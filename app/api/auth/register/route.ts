import {env} from 'cloudflare:workers';
import {handleAccountRequest} from '../../../../lib/account-auth';
export const dynamic='force-dynamic';
export async function POST(req:Request){if(env.AUTH_MODE==='chatgpt')return Response.json({error:'Use the hosted sign-in flow.'},{status:404});return handleAccountRequest(env.DB!,'register',req)}
