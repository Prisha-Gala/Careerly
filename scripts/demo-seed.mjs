import {DatabaseSync} from 'node:sqlite';
import {readdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {hashPassword} from '../lib/passwords.mjs';
import {validateRecord} from '../lib/record-validation.ts';
import {buildDemoData,demoPassword} from '../demo/data.mjs';
import {exportDemoData} from './demo-export.mjs';
process.chdir(fileURLToPath(new URL('../',import.meta.url)));
if(process.argv.includes('--help')){console.log('demo:seed adds two fictional student accounts and demo career records. Re-running refreshes only labelled demo fixtures and future deadlines. demo:clear removes these fixtures and their demo accounts. Real accounts and records are never replaced.');process.exit(0)}
const root='.wrangler/state/v3/d1';
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):e.name.endsWith('.sqlite')?[join(dir,e.name)]:[]);
const files=existsSync(root)?walk(root).filter(file=>{const db=new DatabaseSync(file,{readOnly:true});try{return !!db.prepare("SELECT name FROM sqlite_master WHERE name='account_users'").get()}finally{db.close()}}):[];
if(files.length!==1)throw Error('Run npm run setup first. Exactly one initialized local account database is required.');
const {sets,records}=buildDemoData();
const db=new DatabaseSync(files[0]);db.exec('PRAGMA busy_timeout=5000');
try{
  const now=new Date().toISOString(),hash=process.argv.includes('--clear')?null:await hashPassword(demoPassword);
  db.exec('BEGIN IMMEDIATE');
  for(const set of sets){
    const account=db.prepare('SELECT id,email,role FROM account_users WHERE id=? OR email=?').all(set.id,set.email);
    if(account.some(row=>row.id!==set.id||row.email!==set.email||row.role!=='student'))throw Error('A demo identity conflicts with an existing account. No records were changed.');
  }
  for(const record of records){const old=db.prepare('SELECT owner,kind,data FROM records WHERE id=?').get(record.id);if(old&&(old.owner!==record.owner||old.kind!==record.kind||!JSON.parse(old.data).demo))throw Error('A demo record conflicts with existing data. No records were changed.')}
  if(process.argv.includes('--clear')){
    for(const record of records)db.prepare('DELETE FROM records WHERE id=? AND owner=?').run(record.id,record.owner);
    for(const set of sets){db.prepare('DELETE FROM records WHERE owner=?').run(set.id);db.prepare('DELETE FROM ai_usage WHERE owner=?').run(set.id);db.prepare('DELETE FROM account_sessions WHERE user_id=?').run(set.id);db.prepare('DELETE FROM account_users WHERE id=?').run(set.id)}
    console.log('Removed only the two demo accounts, their owned data and the known shared demo fixtures.');
  }else{
    for(const set of sets)db.prepare("INSERT INTO account_users(id,email,name,password_hash,role,created_at) VALUES(?,?,?,?,'student',?) ON CONFLICT(id) DO NOTHING").run(set.id,set.email,set.name,hash,now);
    for(const record of records){const clean=validateRecord(record.kind,record.data);db.prepare('INSERT INTO records(id,owner,kind,data,updated) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated=excluded.updated').run(record.id,record.owner,record.kind,JSON.stringify(clean),now)}
    console.log(`Loaded ${records.length} labelled fictional records and two student demo accounts. Real records were preserved.`);
    console.log('Student A: aarav.demo@example.test | Student B: meera.demo@example.test');
    console.log('Demo-only password: '+demoPassword);
    console.log('Shared opportunities: 6 open, 1 draft, 1 closed, 1 expired. Only the 6 open published listings enter AI matching.');
  }
  db.exec('COMMIT');
  if(!process.argv.includes('--clear'))exportDemoData();
}catch(error){try{db.exec('ROLLBACK')}catch{};console.error(error.message);process.exitCode=1}
finally{db.close()}
