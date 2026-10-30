// Run with Node 24+. Uses an isolated, in-memory SQLite database and a mocked
// provider; never sends student data to a live AI service.
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import ts from 'typescript';
const database=new DatabaseSync(':memory:');
for(const file of ['0000_wide_sheva_callister.sql','0001_concerned_spyke.sql'])database.exec(readFileSync(new URL('../drizzle/'+file,import.meta.url),'utf8'));
globalThis.careerlyTestEnv={DB:{
  prepare(sql){return {
    values:[],
    bind(...values){this.values=values;return this},
    async run(){return database.prepare(sql).run(...this.values)},
    async first(){return database.prepare(sql).get(...this.values)||null},
    async all(){return {results:database.prepare(sql).all(...this.values)}},
  }},
}};
globalThis.careerlyTestUser=null;
async function load(relative){
  const filename=resolve(relative);
  let code=ts.transpileModule(readFileSync(filename,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
  code=code.replaceAll("'cloudflare:workers'",JSON.stringify('data:text/javascript,export const env=globalThis.careerlyTestEnv'));
  code=code.replaceAll("'../../chatgpt-auth'",JSON.stringify('data:text/javascript,export async function getChatGPTUser(){return globalThis.careerlyTestUser}'));
  code=code.replace(/from ['"]\.\.\/\.\.\/\.\.\/lib\/([^'"]+)['"]/g,(_,name)=>'from '+JSON.stringify(pathToFileURL(resolve('lib',name+'.ts')).href));
  return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
}
const api=await load('app/api/data/route.ts'),ai=await load('app/api/ai/route.ts'),jobs=await load('app/api/opportunities/route.ts');
const {careerContext,unwrapResponse}=await import('../lib/careerly-ai.ts');
const {validateRecord}=await import('../lib/record-validation.ts');
const request=(data,origin='https://careerly.test')=>new Request('https://careerly.test/api',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(data)});
const student=id=>({userId:id,email:id+'@example.test',displayName:id,fullName:id});
let passed=0;
async function check(name,test){await test();console.log('PASS '+name);passed++}
await check('anonymous access is denied',async()=>{assert.equal((await api.GET()).status,401);assert.equal((await ai.GET()).status,401);assert.equal((await ai.POST(request({mode:'chat',message:'Hi'}))).status,401);assert.equal((await jobs.GET()).status,401)});
await check('first student cannot claim administration',async()=>{globalThis.careerlyTestUser=student('a');assert.equal((await (await api.GET()).json()).isAdmin,false);assert.equal(database.prepare('SELECT count(*) n FROM administrators').get().n,0)});
await check('explicit administrator provisions once',async()=>{globalThis.careerlyTestEnv.ADMIN_USER_ID='owner';globalThis.careerlyTestUser=student('owner');assert.equal((await (await api.GET()).json()).isAdmin,true)});
const create=(kind,id,data)=>api.POST(request({action:'save',kind,id,data}));
await create('opportunities','job-open',{company:'Test Company',title:'React Intern',status:'Published',deadline:'2099-01-01',requirements:'React, SQL',url:'https://example.test/jobs/1'});
await create('opportunities','job-draft',{company:'Hidden Company',title:'Draft role',status:'Draft',deadline:'2099-01-01'});
await create('opportunities','job-expired',{company:'Old Company',title:'Expired role',status:'Published',deadline:'2020-01-01'});
await check('students see published roles and matches exclude expired roles',async()=>{globalThis.careerlyTestUser=student('a');const rows=(await (await api.GET()).json()).records;assert(!rows.some(r=>r.id==='job-draft'));assert(rows.some(r=>r.id==='job-open'));assert.deepEqual((await (await jobs.GET()).json()).opportunities.map(r=>r.id),['job-open'])});
await check('student cannot publish shared records',async()=>assert.equal((await create('opportunities','bad',{title:'Bad',company:'Bad',status:'Published',deadline:'2099-01-01'})).status,403));
await check('application persists and stays private',async()=>{assert.equal((await create('applications','app-a',{company:'Company',role:'Intern',status:'Saved',notes:'Private notes'})).status,200);assert((await (await api.GET()).json()).records.some(r=>r.id==='app-a'));globalThis.careerlyTestUser=student('b');assert(!(await (await api.GET()).json()).records.some(r=>r.id==='app-a'));assert.equal((await create('applications','app-a',{company:'Hijack',role:'Intern',status:'Applied'})).status,403)});
await check('private profile sharing is opt in',async()=>{globalThis.careerlyTestUser=student('a');await create('profile',null,{name:'Private student',share:false});globalThis.careerlyTestUser=student('b');await create('profile',null,{name:'Shared student',share:true});globalThis.careerlyTestUser=student('owner');const result=await (await api.GET()).json();assert.deepEqual(result.students.map(s=>s.name),['Shared student']);assert(!result.records.some(r=>r.kind==='profile'))});
await check('server rejects missing fields, unsafe links, invalid statuses and progress',async()=>{globalThis.careerlyTestUser=student('a');for(const [kind,row] of [['applications',{company:'Only company',status:'Saved'}],['projects',{title:'Bad link',url:'javascript:alert(1)'}],['applications',{company:'Company',role:'Role',status:'made up'}],['skills',{name:'React',progress:200}]])assert.equal((await create(kind,null,row)).status,400);assert.throws(()=>validateRecord('profile',{name:'A',share:'yes'}))});
await check('cross-origin writes are denied',async()=>{assert.equal((await api.POST(request({action:'delete',kind:'applications',id:'app-a'},'https://evil.test'))).status,403);assert.equal((await ai.POST(request({mode:'chat',message:'Hi'},'https://evil.test'))).status,403)});
await check('missing provider is reported without fake generation',async()=>{assert.equal((await ai.POST(request({mode:'resume'}))).status,503);assert.equal((await (await ai.GET()).json()).configured,false)});
await check('automatic AI context excludes contact fields, private notes and shared students',async()=>{const facts=JSON.stringify(careerContext([{kind:'profile',name:'Student',email:'private@example.test',share:true,goal:'Developer'},{kind:'applications',notes:'Private notes'},{kind:'interviews',notes:'Private answer'},{kind:'projects',title:'Portfolio',github:'https://private.test'}]));assert(facts.includes('Portfolio'));assert(!facts.includes('private'));assert(!facts.includes('share'))});
const originalFetch=globalThis.fetch;
let providerRequests=[];
let result={message:'Here is a grounded suggestion.',draft:null,projects:[],matches:[]};
globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.openai.com/v1/responses');providerRequests.push(JSON.parse(options.body));return Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(result)}]}]})};
globalThis.careerlyTestEnv.OPENAI_API_KEY='test-placeholder';
await check('AI validates request before calling provider',async()=>{assert.equal((await ai.POST(request({mode:'chat',message:''}))).status,400);assert.equal(providerRequests.length,0)});
await check('AI resume uses structured output, saves private history and excludes contact fields',async()=>{result={message:'Review your draft.',draft:{summary:'Student building React projects.',education:'',experience:'',skills:'React',projects:'Portfolio'},projects:[],matches:[]};const response=await ai.POST(request({mode:'resume',resume:{name:'Test',email:'contact@example.test',skills:'React'}}));assert.equal(response.status,200);const sent=providerRequests.at(-1);assert.equal(sent.store,false);assert.equal(sent.text.format.strict,true);assert(!JSON.stringify(sent.input).includes('contact@example.test'));assert.equal((await (await ai.GET()).json()).history.length,1);globalThis.careerlyTestUser=student('b');assert.equal((await (await ai.GET()).json()).history.length,0);globalThis.careerlyTestUser=student('a');assert(!(await (await api.GET()).json()).records.some(row=>row.kind==='ai_chat'))});
await check('invented opportunity IDs are removed and URLs come from the database',async()=>{result={message:'A matching role.',draft:null,projects:[],matches:[{id:'invented-job',reason:'Fabricated',gaps:[]},{id:'job-open',reason:'React matches',gaps:['SQL']}]};const response=await ai.POST(request({mode:'recommendations'}));assert.equal(response.status,200);const body=await response.json();assert.deepEqual(body.result.matches.map(match=>match.id),['job-open']);assert.equal(body.result.matches[0].opportunity.url,'https://example.test/jobs/1');assert(!JSON.stringify(providerRequests.at(-1)).includes('Hidden Company'))});
await check('malformed and incomplete model output is rejected',async()=>{assert.throws(()=>unwrapResponse({status:'incomplete',output:[]}));assert.throws(()=>unwrapResponse({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'{}'}]}]}));assert.throws(()=>unwrapResponse({status:'completed',output:[{type:'message',content:[{type:'refusal'}]}]}))});
await check('20-per-hour usage limit is atomic and stops provider calls',async()=>{database.prepare('UPDATE ai_usage SET count=20 WHERE owner=?').run('a');const before=providerRequests.length;assert.equal((await ai.POST(request({mode:'chat',message:'One more'}))).status,429);assert.equal(providerRequests.length,before)});
await check('clear history affects only the signed-in student',async()=>{globalThis.careerlyTestUser=student('b');database.prepare('INSERT INTO records VALUES(?,?,?,?,?)').run('chat-b','b','ai_chat',JSON.stringify({prompt:'Private',result:{message:'Private'}}),new Date().toISOString());globalThis.careerlyTestUser=student('a');const response=await ai.DELETE(new Request('https://careerly.test/api/ai',{method:'DELETE',headers:{origin:'https://careerly.test'}}));assert.equal(response.status,200);assert.equal((await (await ai.GET()).json()).history.length,0);globalThis.careerlyTestUser=student('b');assert.equal((await (await ai.GET()).json()).history.length,1)});
await check('exhausted API credits produce an actionable message without exposing provider details',async()=>{
  globalThis.careerlyTestUser=student('b');
  globalThis.fetch=async()=>Response.json({error:{code:'credit_balance_exhausted',type:'insufficient_quota',message:'Private provider diagnostic'}},{status:429});
  const response=await ai.POST(request({mode:'chat',message:'Connection test'}));
  const body=await response.json();
  assert.equal(response.status,502);assert.equal(body.code,'ai_credits_exhausted');
  assert(body.error.includes('add credits'));assert(!JSON.stringify(body).includes('Private provider diagnostic'));
});
globalThis.careerlyTestEnv.AI_PROVIDER='gemini';
globalThis.careerlyTestEnv.GEMINI_API_KEY='synthetic-gemini-key';
await check('Gemini requests use Google headers and structured JSON and preserve grounded matches',async()=>{
  globalThis.fetch=async(url,options)=>{
    assert.equal(url,'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent');
    assert.equal(options.headers['x-goog-api-key'],'synthetic-gemini-key');assert(!('Authorization' in options.headers));
    const body=JSON.parse(options.body);assert.equal(body.generationConfig.responseMimeType,'application/json');assert(body.generationConfig.responseJsonSchema.properties.matches);assert(body.systemInstruction.parts[0].text.includes('Never invent'));
    return Response.json({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({message:'React fits this role.',draft:null,projects:[],matches:[{id:'job-open',reason:'React matches',gaps:['SQL']},{id:'invented',reason:'No',gaps:[]}]})}]}}]});
  };
  const response=await ai.POST(request({mode:'recommendations'}));assert.equal(response.status,200);assert.deepEqual((await response.json()).result.matches.map(item=>item.id),['job-open']);assert.equal((await (await ai.GET()).json()).provider,'gemini');
});
await check('Gemini quota failures are distinct from OpenAI credit errors',async()=>{
  globalThis.fetch=async()=>Response.json({error:{status:'RESOURCE_EXHAUSTED',message:'Private quota diagnostic'}},{status:429});
  const response=await ai.POST(request({mode:'projects'}));const body=await response.json();assert.equal(body.code,'ai_rate_limited');assert(body.error.includes('Gemini'));assert(!JSON.stringify(body).includes('Private quota diagnostic'));
});
await check('Google invalid-key errors are actionable and do not leak diagnostics',async()=>{
  globalThis.fetch=async()=>Response.json({error:{details:[{reason:'API_KEY_INVALID'}],message:'Private key diagnostic'}},{status:400});
  const body=await (await ai.POST(request({mode:'projects'}))).json();assert.equal(body.code,'ai_connection_error');assert(!JSON.stringify(body).includes('Private key diagnostic'));
});
await check('temporary Gemini overload is explained without hiding saved demo data',async()=>{
  globalThis.fetch=async()=>Response.json({error:{status:'UNAVAILABLE',message:'Private provider diagnostic'}},{status:503});
  const response=await ai.POST(request({mode:'recommendations'}));const body=await response.json();assert.equal(body.code,'ai_provider_busy');assert(body.error.includes('temporarily busy'));assert(!JSON.stringify(body).includes('Private provider diagnostic'));
});
await check('selected Gemini never falls back to a paid OpenAI connection when its key is missing',async()=>{
  delete globalThis.careerlyTestEnv.GEMINI_API_KEY;
  globalThis.fetch=async()=>{throw Error('Provider should not be called')};
  assert.equal((await ai.POST(request({mode:'projects'}))).status,503);assert.equal((await (await ai.GET()).json()).configured,false);
});
globalThis.fetch=originalFetch;
console.log(`\n${passed} checks passed. Provider calls were mocked; live AI generation is not verified.`);
database.close();
