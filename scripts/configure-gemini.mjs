import {createInterface} from 'node:readline/promises';
import {Writable} from 'node:stream';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('../',import.meta.url)));
if(!process.stdin.isTTY)throw Error('Use an interactive terminal for private key entry.');
const reader=createInterface({input:process.stdin,output:new Writable({write(_chunk,_encoding,done){done()}}),terminal:true,historySize:0});
reader.on('error',()=>{});
console.log('Enter the Gemini API key on stdin (input is hidden):');
try{
  const key=(await reader.question('')).trim();
  if(!/^[A-Za-z0-9_.-]{20,500}$/.test(key))throw Error('The key format was not accepted.');
  let settings=existsSync('.dev.vars')?readFileSync('.dev.vars','utf8'):'';
  for(const [name,value] of Object.entries({AI_PROVIDER:'gemini',GEMINI_API_KEY:key,GEMINI_MODEL:'gemini-3.1-flash-lite'})){
    settings=settings.replace(new RegExp('^'+name+'=.*(?:\\r?\\n|$)','gm'),'');
    if(settings&&!settings.endsWith('\n'))settings+='\n';
    settings+=name+'='+JSON.stringify(value)+'\n';
  }
  writeFileSync('.dev.vars',settings,{mode:0o600});
  console.log('Gemini configured in private local server settings. Existing settings preserved.');
  const response=await fetch('https://generativelanguage.googleapis.com/v1beta/models',{headers:{'x-goog-api-key':key},signal:AbortSignal.timeout(30000)});
  const body=await response.json();
  if(!response.ok){const reason=body.error?.details?.find(item=>item.reason)?.reason||body.error?.status||'provider_error';console.log('Google key check: HTTP '+response.status+'; '+reason);process.exitCode=1}
  else{const models=body.models||[];console.log('Google key check passed. Text generation models available: '+models.filter(model=>model.supportedGenerationMethods?.includes('generateContent')).length);console.log('Configured model listed: '+models.some(model=>model.name==='models/gemini-3.1-flash-lite'))}
}catch(error){console.error(error.name==='TimeoutError'?'Google key check timed out.':error instanceof Error&&/format/.test(error.message)?error.message:'Could not finish the secure Gemini connection check.');process.exitCode=1}
finally{reader.close();process.stdin.pause();process.stdout.write('',()=>process.stderr.write('',()=>process.exit(process.exitCode||0)))}
