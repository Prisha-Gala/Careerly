import Workspace from './workspace';
import {getChatGPTUser,passwordAuthEnabled} from './chatgpt-auth';
import {redirect} from 'next/navigation';
export const dynamic='force-dynamic';
export default async function Home(){const user=await getChatGPTUser();const passwordMode=passwordAuthEnabled();if(passwordMode&&!user)redirect('/login');return <Workspace initialAdmin={user?.role==='admin'} passwordMode={passwordMode}/>}
