import {instructions,outputSchema,resultSchema,unwrapResponse} from './careerly-ai.ts';
type Settings={AI_PROVIDER?:string;GEMINI_API_KEY?:string;GEMINI_MODEL?:string;OPENAI_API_KEY?:string;OPENAI_MODEL?:string};
type Provider={name:'gemini'|'openai';key:string;model:string};
type Input={conversation:{role:string;content:string}[];content:unknown};
export function aiProvider(settings:Settings):Provider{
  const name=settings.AI_PROVIDER||(settings.GEMINI_API_KEY?'gemini':'openai');
  if(name!=='gemini'&&name!=='openai')throw Error('Unsupported AI provider.');
  return name==='gemini'?{name,key:settings.GEMINI_API_KEY||'',model:settings.GEMINI_MODEL||'gemini-3.1-flash-lite'}:{name,key:settings.OPENAI_API_KEY||'',model:settings.OPENAI_MODEL||'gpt-4.1-mini'};
}
export function requestAI(provider:Provider,input:Input){
  if(provider.name==='gemini')return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(provider.model)}:generateContent`,{
    method:'POST',headers:{'x-goog-api-key':provider.key,'Content-Type':'application/json'},
    body:JSON.stringify({systemInstruction:{parts:[{text:instructions}]},contents:[...input.conversation.map(item=>({role:item.role==='assistant'?'model':'user',parts:[{text:item.content}]})),{role:'user',parts:[{text:JSON.stringify(input.content)}]}],generationConfig:{maxOutputTokens:6000,responseMimeType:'application/json',responseJsonSchema:outputSchema}}),signal:AbortSignal.timeout(55000),
  });
  return fetch('https://api.openai.com/v1/responses',{
    method:'POST',headers:{Authorization:`Bearer ${provider.key}`,'Content-Type':'application/json'},
    body:JSON.stringify({model:provider.model,store:false,instructions,max_output_tokens:4500,text:{format:{type:'json_schema',name:'careerly_result',strict:true,schema:outputSchema}},input:[...input.conversation,{role:'user',content:JSON.stringify(input.content)}]}),signal:AbortSignal.timeout(55000),
  });
}
export function providerResult(provider:Provider,body:any){
  if(provider.name==='openai')return unwrapResponse(body);
  const candidate=body.candidates?.[0];
  if(candidate?.finishReason!=='STOP')throw Error('Gemini did not return a complete answer.');
  const content=(candidate.content?.parts||[]).filter((part:any)=>!part.thought&&typeof part.text==='string').map((part:any)=>part.text).join('');
  return resultSchema.parse(JSON.parse(content));
}
