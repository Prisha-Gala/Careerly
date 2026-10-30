import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {getOpportunities} from '../../../lib/opportunities';
export const dynamic='force-dynamic';
export async function GET(){
  if(!await getChatGPTUser())return Response.json({error:'Sign in required'},{status:401});
  return Response.json(await getOpportunities(env.DB!),{headers:{'Cache-Control':'private, no-store'}});
}
