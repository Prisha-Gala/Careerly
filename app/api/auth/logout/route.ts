import {env} from 'cloudflare:workers';
import {handleAccountRequest} from '../../../../lib/account-auth';
export const dynamic='force-dynamic';
export async function POST(req:Request){return handleAccountRequest(env.DB!,'logout',req)}
