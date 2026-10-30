import {z} from 'zod';
import {dummyPasswordHash,hashPassword,newSessionToken,tokenHash,verifyPassword} from './passwords.mjs';
export const sessionCookie='careerly_session';
const duration=7*24*60*60*1000;
const email=z.string().trim().email().max(254).transform(value=>value.toLowerCase());
const password=z.string().min(12,'Use at least 12 characters for your password.').max(128);
const registerInput=z.object({name:z.string().trim().min(2).max(100),email,password,confirmPassword:z.string(),college:z.string().trim().max(200).default('')}).strict().refine(data=>data.password===data.confirmPassword,{message:'The passwords do not match.'});
const loginInput=z.object({email,password:z.string().min(1).max(128),portal:z.enum(['student','admin'])}).strict();
export type AccountUser={userId:string;displayName:string;fullName:string;email:string;role:'student'|'admin'};
type AccountRow={id:string;name:string;email:string;role:'student'|'admin';password_hash:string};
const publicUser=(row:AccountRow):AccountUser=>({userId:row.id,displayName:row.name,fullName:row.name,email:row.email,role:row.role});
const json=(body:unknown,status=200,headers:Record<string,string>={})=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store',...headers}});
function cookieToken(cookie:string){const matches=cookie.split(';').map(value=>value.trim()).filter(value=>value.startsWith(sessionCookie+'='));if(matches.length!==1)return '';const value=matches[0].slice(sessionCookie.length+1);return /^[A-Za-z0-9_-]{43}$/.test(value)?value:''}
function cookie(value:string,req:Request,clear=false){return `${sessionCookie}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear?0:duration/1000}${new URL(req.url).protocol==='https:'?'; Secure':''}`}
async function newSession(db:D1Database,userId:string,req:Request){const token=newSessionToken();await db.prepare('DELETE FROM account_sessions WHERE expires_at<?').bind(Date.now()).run();await db.prepare('INSERT INTO account_sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').bind(tokenHash(token),userId,Date.now()+duration).run();return cookie(token,req)}
export async function sessionUser(db:D1Database,cookieHeader:string):Promise<AccountUser|null>{const token=cookieToken(cookieHeader);if(!token)return null;const row=await db.prepare('SELECT u.id,u.name,u.email,u.role FROM account_sessions s JOIN account_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?').bind(tokenHash(token),Date.now()).first<AccountRow>();return row?publicUser(row):null}
async function allowed(db:D1Database,key:string,limit:number,window:number){const bucket=Math.floor(Date.now()/window);await db.prepare('DELETE FROM auth_attempts WHERE expires_at<?').bind(Date.now()).run();const row=await db.prepare('INSERT INTO auth_attempts(key,bucket,count,expires_at) VALUES(?,?,1,?) ON CONFLICT(key,bucket) DO UPDATE SET count=count+1 WHERE count<? RETURNING count').bind(tokenHash(key),bucket,(bucket+1)*window,limit).first();return !!row}
export async function handleAccountRequest(db:D1Database,action:'register'|'login'|'logout',req:Request){
  if(req.headers.get('origin')!==new URL(req.url).origin)return json({error:'Invalid request origin.'},403);
  if(action==='logout'){
    const token=cookieToken(req.headers.get('cookie')||'');
    if(token)await db.prepare('DELETE FROM account_sessions WHERE token_hash=?').bind(tokenHash(token)).run();
    return json({ok:true},200,{'Set-Cookie':cookie('',req,true)});
  }
  try{
    const raw=await req.text();if(raw.length>10000)return json({error:'Please shorten the submitted information.'},413);
    const input=JSON.parse(raw);
    const ip=req.headers.get('cf-connecting-ip')||'local';
    if(!await allowed(db,`ip:${ip}`,100,15*60*1000))return json({error:'Too many sign-in attempts. Please try again in 15 minutes.'},429);
    if(action==='register'){
      const parsed=registerInput.safeParse(input);if(!parsed.success)return json({error:parsed.error.issues[0]?.message||'Please check the registration details.'},400);
      const data=parsed.data;
      if(!await allowed(db,`register:${ip}`,10,60*60*1000))return json({error:'Too many registrations. Please try again later.'},429);
      if(await db.prepare('SELECT id FROM account_users WHERE email=?').bind(data.email).first())return json({error:'An account with this email already exists. Please sign in.'},409);
      const id=crypto.randomUUID(),now=new Date().toISOString(),hash=await hashPassword(data.password);
      await db.batch([
        db.prepare("INSERT INTO account_users(id,email,name,password_hash,role,created_at) VALUES(?,?,?,?,'student',?)").bind(id,data.email,data.name,hash,now),
        db.prepare('INSERT INTO records(id,owner,kind,data,updated) VALUES(?,?,?,?,?)').bind(id,id,'profile',JSON.stringify({name:data.name,college:data.college,share:false}),now),
      ]);
      const setCookie=await newSession(db,id,req);
      return json({ok:true,user:{userId:id,email:data.email,displayName:data.name,fullName:data.name,role:'student'},redirect:'/'},201,{'Set-Cookie':setCookie});
    }
    const parsed=loginInput.safeParse(input);if(!parsed.success)return json({error:'Enter a valid email address and password.'},400);
    const data=parsed.data;
    if(!await allowed(db,`email:${data.email}`,10,15*60*1000))return json({error:'Too many sign-in attempts for this account. Please try again in 15 minutes.'},429);
    const account=await db.prepare('SELECT * FROM account_users WHERE email=?').bind(data.email).first<AccountRow>();
    const valid=await verifyPassword(data.password,account?.password_hash||dummyPasswordHash);
    if(!account||!valid||account.role!==data.portal)return json({error:'The email and password do not match an account for this login page.'},401);
    const setCookie=await newSession(db,account.id,req);
    return json({ok:true,user:publicUser(account),redirect:'/'},200,{'Set-Cookie':setCookie});
  }catch(error){
    if(error instanceof SyntaxError)return json({error:'Invalid form data.'},400);
    if(error instanceof Error&&/UNIQUE constraint failed/.test(error.message))return json({error:'An account with this email already exists. Please sign in.'},409);
    return json({error:'We could not complete this request. Please try again.'},500);
  }
}
