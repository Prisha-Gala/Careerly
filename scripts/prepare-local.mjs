import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
if(!existsSync('dist/server/wrangler.json'))throw Error('Build the project first: node scripts/run-framework.mjs build');
const base=['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state'];
function run(args,capture=false){
  const result=spawnSync(process.execPath,[...base,...args],{encoding:'utf8',stdio:capture?'pipe':'inherit'});
  if(result.error)throw result.error;
  if(result.status!==0)throw Error(capture?result.stderr:'Local database initialization failed.');
  return result.stdout;
}
const query=JSON.parse(run(['--command',"SELECT name FROM sqlite_master WHERE type='table'",'--json'],true));
const tables=new Set(query.flatMap(item=>item.results||[]).map(row=>row.name));
if(!tables.has('records')&&!tables.has('administrators'))run(['--file','drizzle/0000_wide_sheva_callister.sql']);
else if(!tables.has('records')||!tables.has('administrators'))throw Error('The local database is partially initialized. Inspect its schema before continuing.');
if(!tables.has('ai_usage'))run(['--file','drizzle/0001_concerned_spyke.sql']);
const accounts=['account_users','account_sessions','auth_attempts'];
if(accounts.every(name=>!tables.has(name)))run(['--file','drizzle/0002_cool_luminals.sql']);
else if(!accounts.every(name=>tables.has(name)))throw Error('The account database is partially initialized. Inspect the schema before continuing.');
console.log('Local Careerly database is ready. Existing records were preserved.');
