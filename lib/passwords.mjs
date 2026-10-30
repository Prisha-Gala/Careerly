import {randomBytes,scrypt,timingSafeEqual,createHash} from 'node:crypto';
const options={N:16384,r:8,p:5,maxmem:48*1024*1024};
/** @param {string} password @param {string} salt @returns {Promise<Buffer>} */
function derive(password,salt){return new Promise((resolve,reject)=>scrypt(password,salt,64,options,(error,key)=>error?reject(error):resolve(key)))}
/** @param {string} password */
export async function hashPassword(password){const salt=randomBytes(16).toString('hex');return `scrypt$16384$8$5$${salt}$${(await derive(password,salt)).toString('hex')}`}
/** @param {string} password @param {string} encoded */
export async function verifyPassword(password,encoded){
  const pieces=encoded.split('$');
  if(pieces.length!==6||pieces.slice(0,4).join('$')!=='scrypt$16384$8$5'||!/^[0-9a-f]{32}$/.test(pieces[4])||!/^[0-9a-f]{128}$/.test(pieces[5]))return false;
  const actual=await derive(password,pieces[4]),expected=Buffer.from(pieces[5],'hex');return timingSafeEqual(actual,expected);
}
export const dummyPasswordHash='scrypt$16384$8$5$'+'0'.repeat(32)+'$'+'0'.repeat(128);
export const newSessionToken=()=>randomBytes(32).toString('base64url');
/** @param {string} value */
export const tokenHash=value=>createHash('sha256').update(value).digest('hex');
