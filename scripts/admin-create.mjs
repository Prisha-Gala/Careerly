import {DatabaseSync} from 'node:sqlite';
import {readdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {createInterface} from 'node:readline/promises';
import {Writable} from 'node:stream';
import {hashPassword} from '../lib/passwords.mjs';

process.chdir(fileURLToPath(new URL('../',import.meta.url)));
if(process.argv.includes('--help')){console.log('Run npm run admin:create after npm run setup. You will choose an admin name, email and password. The password is entered privately and only its hash is saved in the local database.');process.exit(0)}
if(!process.stdin.isTTY){console.error('Run this command directly in the VS Code terminal so the password can be entered privately.');process.exit(1)}
const directory='.wrangler/state/v3/d1';
function scan(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?scan(join(dir,entry.name)):entry.name.endsWith('.sqlite')?[join(dir,entry.name)]:[])}
const candidates=existsSync(directory)?scan(directory).filter(file=>{const db=new DatabaseSync(file,{readOnly:true});try{return !!db.prepare("SELECT name FROM sqlite_master WHERE name='account_users'").get()}finally{db.close()}}):[];
if(candidates.length!==1){console.error('Run npm run setup first. Exactly one initialized local account database is required.');process.exit(1)}
let hidden=false;
const output=new Writable({write(chunk,encoding,done){if(!hidden)process.stdout.write(chunk,encoding);done()}});
const reader=createInterface({input:process.stdin,output,terminal:true,historySize:0});
let closing=false;
reader.on('error',error=>{
  // Some Windows pseudo terminals reject restoring console mode during cleanup.
  if(closing&&error.code==='EPERM'&&error.syscall==='setRawMode')return;
  console.error('Terminal input failed. Open a new terminal and try again.');process.exitCode=1;reader.close();
});
async function ask(question){return reader.question(question)}
async function secret(question){
  process.stdout.write(question);hidden=true;
  try{return await reader.question('')}
  finally{hidden=false;process.stdout.write('\n')}
}
let db;
try{
  console.log('Create a separate Careerly administrator. Password characters will not be displayed.');
  const name=String(await ask('Admin full name: ')).trim();
  const email=String(await ask('Admin email: ')).trim().toLowerCase();
  if(name.length<2||name.length>100||email.length>254||!/^\S+@\S+\.\S+$/.test(email))throw Error('Enter a valid name and email.');
  const password=String(await secret('Choose a password (8 to 128 characters): '));
  const confirmation=String(await secret('Confirm password: '));
  if(password.length<8||password.length>128)throw Error('The password must contain 8 to 128 characters.');
  if(password!==confirmation)throw Error('The passwords do not match.');
  const hash=await hashPassword(password),id=randomUUID(),now=new Date().toISOString();
  db=new DatabaseSync(candidates[0]);db.exec('PRAGMA busy_timeout=5000');
  if(db.prepare('SELECT id FROM account_users WHERE email=?').get(email))throw Error('That email is already registered. Choose a separate, unused admin email. Existing accounts are not changed.');
  db.exec('BEGIN IMMEDIATE');
  try{
    db.prepare("INSERT INTO account_users(id,email,name,password_hash,role,created_at) VALUES(?,?,?,?,'admin',?)").run(id,email,name,hash,now);
    db.prepare('INSERT INTO records(id,owner,kind,data,updated) VALUES(?,?,?,?,?)').run(id,id,'profile',JSON.stringify({name,share:false}),now);
    db.exec('COMMIT');
  }catch(error){db.exec('ROLLBACK');throw error}
  console.log('Admin account created in the local database. Start Careerly and open /admin/login.');
}catch(error){console.error(error instanceof Error?error.message:'Could not create administrator.');process.exitCode=1}
finally{
  closing=true;reader.close();process.stdin.pause();db?.close();
  // Flush the terminal before exiting; Windows console handles may stay active.
  process.stdout.write('',()=>process.stderr.write('',()=>process.exit(process.exitCode||0)));
}
