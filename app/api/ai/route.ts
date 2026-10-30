import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {aiRequest,careerContext,providerFailure} from '../../../lib/careerly-ai';
import {aiProvider,requestAI,providerResult} from '../../../lib/ai-provider';
import {getOpportunities} from '../../../lib/opportunities';
export const dynamic='force-dynamic';
const privateHeaders={'Cache-Control':'private, no-store'};
export async function GET(){
  const user=await getChatGPTUser();
  if(!user)return Response.json({error:'Sign in required'},{status:401});
  const history=await env.DB!.prepare("SELECT id,data,updated FROM records WHERE owner=? AND kind='ai_chat' ORDER BY updated DESC LIMIT 20").bind(user.userId).all<any>();
  const provider=aiProvider(env);
  return Response.json({configured:!!provider.key,provider:provider.name,history:history.results.reverse().map(row=>({id:row.id,...JSON.parse(row.data),updated:row.updated}))},{headers:privateHeaders});
}
export async function DELETE(req:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in required'},{status:401});
  if(req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'Invalid origin'},{status:403});
  await env.DB!.prepare("DELETE FROM records WHERE owner=? AND kind='ai_chat'").bind(user.userId).run();
  return Response.json({ok:true},{headers:privateHeaders});
}
export async function POST(req:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in required'},{status:401});
  if(req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'Invalid origin'},{status:403});
  const provider=aiProvider(env);
  if(!provider.key)return Response.json({error:'AI is awaiting a secure provider connection. Your saved workspace is available.'},{status:503,headers:privateHeaders});
  try{
    const raw=await req.text();if(raw.length>40000)return Response.json({error:'Please shorten your request.'},{status:413});
    const input=aiRequest.parse(JSON.parse(raw));
    if(['chat','interview'].includes(input.mode)&&!input.message)return Response.json({error:'Enter your question or practice answer.'},{status:400});
    const hour=new Date().toISOString().slice(0,13);
    const reservation=await env.DB!.prepare('INSERT INTO ai_usage(owner,hour,count) VALUES(?,?,1) ON CONFLICT(owner,hour) DO UPDATE SET count=count+1 WHERE count<20 RETURNING count').bind(user.userId,hour).first();
    if(!reservation)return Response.json({error:'You have reached 20 AI requests this hour. Please try again next hour.'},{status:429});
    const records=await env.DB!.prepare("SELECT kind,data FROM records WHERE owner=? AND kind IN ('profile','projects','skills','coding','resumes') ORDER BY updated DESC LIMIT 60").bind(user.userId).all<any>();
    const facts=careerContext(records.results.map(row=>({...JSON.parse(row.data),kind:row.kind})));
    const {opportunities}=input.mode==='recommendations'?await getOpportunities(env.DB!):{opportunities:[]};
    const keywords=JSON.stringify(facts).toLowerCase().match(/[a-z][a-z+#.]{2,}/g)||[];
    const score=(item:typeof opportunities[number])=>[...new Set(keywords)].filter(word=>(item.title+' '+item.requirements).toLowerCase().includes(word)).length;
    const candidates=[...opportunities].sort((a,b)=>score(b)-score(a)).slice(0,40);
    const history=await env.DB!.prepare("SELECT data FROM records WHERE owner=? AND kind='ai_chat' ORDER BY updated DESC LIMIT 6").bind(user.userId).all<any>();
    const conversation=input.mode==='chat'?history.results.reverse().flatMap(row=>{const entry=JSON.parse(row.data);return [{role:'user',content:String(entry.prompt).slice(0,4000)},{role:'assistant',content:String(entry.result.message).slice(0,5000)}]}):[];
    const resume=input.resume?{...input.resume,name:undefined,email:undefined,title:undefined}:undefined;
    const response=await requestAI(provider,{conversation,content:{mode:input.mode,message:input.message,jobDescription:input.jobDescription,resume,careerFacts:facts,opportunities:candidates.map(({id,title,company,location,type,deadline,requirements})=>({id,title:title.slice(0,200),company:company.slice(0,200),location:String(location||'').slice(0,200),type,deadline,requirements:String(requirements||'').slice(0,1500)}))}});
    if(!response.ok){
      const failure=await response.json().catch(()=>({})) as any;
      return Response.json(providerFailure(response.status,failure.error,provider.name),{status:502,headers:privateHeaders});
    }
    const result=providerResult(provider,await response.json());
    if(input.mode!=='resume')result.draft=null;
    if(input.mode!=='projects')result.projects=[];
    result.matches=input.mode==='recommendations'?result.matches.filter(match=>candidates.some(item=>item.id===match.id)):[];
    const matches=result.matches.map(match=>({...match,opportunity:opportunities.find(item=>item.id===match.id)!}));
    const id=crypto.randomUUID(),updated=new Date().toISOString();
    await env.DB!.prepare('INSERT INTO records(id,owner,kind,data,updated) VALUES(?,?,?,?,?)').bind(id,user.userId,'ai_chat',JSON.stringify({mode:input.mode,prompt:input.message||({resume:'Draft my resume',projects:'Suggest portfolio projects',recommendations:'Find matching opportunities',interview:'Practice an interview',chat:'Career advice'}[input.mode]),result:{...result,matches}}),updated).run();
    await env.DB!.prepare("DELETE FROM records WHERE owner=? AND kind='ai_chat' AND id NOT IN (SELECT id FROM records WHERE owner=? AND kind='ai_chat' ORDER BY updated DESC LIMIT 20)").bind(user.userId,user.userId).run();
    await env.DB!.prepare('DELETE FROM ai_usage WHERE owner=? AND hour<?').bind(user.userId,new Date(Date.now()-86400000).toISOString().slice(0,13)).run();
    return Response.json({id,result:{...result,matches},updated},{headers:privateHeaders});
  }catch(error){
    const timeout=error instanceof Error&&['TimeoutError','AbortError'].includes(error.name);
    return Response.json({error:timeout?'The AI took too long. Please try again.':'The request or AI response could not be processed. Try a shorter request.'},{status:timeout?504:400,headers:privateHeaders});
  }
}
