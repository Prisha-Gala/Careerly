import {existsSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// Resolve from the script so setup also works when launched through VS Code.
process.chdir(fileURLToPath(new URL('../',import.meta.url)));
const major=Number(process.versions.node.split('.')[0]);
if(major<24){
  console.error('Please install Node.js 24 or newer, reopen VS Code, and run setup again.');
  process.exit(1);
}
function run(command,args){
  const result=spawnSync(command,args,{stdio:'inherit'});
  if(result.error){console.error(result.error.message);process.exit(1)}
  if(result.status!==0)process.exit(result.status||1);
}
if(!existsSync('node_modules/vinext')){
  console.log('Installing Careerly dependencies. This needs an internet connection.');
  if(process.platform==='win32'){
    // The command is fixed text; no user input or credential is passed to it.
    run(process.env.ComSpec||'cmd.exe',['/d','/s','/c','npm.cmd exec --yes --package=pnpm@11.25.0 -- pnpm install --frozen-lockfile']);
  }else{
    run('npm',['exec','--yes','--package=pnpm@11.25.0','--','pnpm','install','--frozen-lockfile']);
  }
}
// Create only the non-secret local authentication setting. Never replace an
// existing settings file or require an AI key for ordinary workspace features.
if(!existsSync('.dev.vars'))writeFileSync('.dev.vars','# Careerly email and password accounts. AI setup is optional.\nAUTH_MODE=password\n',{flag:'wx'});
console.log('Building Careerly. Stop any running Careerly server before setup.');
run(process.execPath,['scripts/run-framework.mjs','build']);
console.log('Preparing the separate local database. Existing records are preserved.');
run(process.execPath,['scripts/prepare-local.mjs']);
console.log('\nCareerly is ready. Run npm run dev. The website will open in your default browser when ready.');
console.log('Students register at /register. To create a separate admin account, run npm run admin:create.');
