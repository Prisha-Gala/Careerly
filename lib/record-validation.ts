import {z} from 'zod';
const required:Record<string,string[]>={profile:['name'],applications:['company','role'],resumes:['title','name'],projects:['title'],skills:['name'],coding:['title','date'],interviews:['question'],companies:['name'],opportunities:['company','title','deadline'],questions:['question'],resources:['title','url'],announcements:['title','description']};
export function validateRecord(kind:string,input:unknown){
  const row=z.record(z.unknown()).parse(input);
  for(const field of required[kind]||[])z.string().trim().min(1,`Please complete ${field}`).max(12000).parse(row[field]);
  for(const field of ['url','github'])if(row[field]){
    const url=z.string().url('Enter a valid web address').parse(row[field]);
    if(!/^https?:\/\//i.test(url))throw Error('Links must start with https:// or http://');
  }
  for(const field of ['date','deadline'])if(row[field]&&!/^\d{4}-\d{2}-\d{2}$/.test(String(row[field])))throw Error('Enter a valid date');
  if(kind==='applications'&&!['Saved','Applied','Assessment','Interview','Offered','Rejected','Withdrawn'].includes(String(row.status)))throw Error('Choose a valid application status');
  if(kind==='opportunities'&&!['Published','Draft','Closed'].includes(String(row.status)))throw Error('Choose a valid opportunity status');
  if(kind==='profile'&&row.share!==undefined&&typeof row.share!=='boolean')throw Error('Invalid sharing preference');
  if(kind==='skills')for(const field of ['progress','target'])row[field]=z.coerce.number().min(0).max(100).parse(row[field]??(field==='target'?100:0));
  if(kind==='coding'&&!['Easy','Medium','Hard'].includes(String(row.difficulty)))throw Error('Choose a valid difficulty');
  if(kind==='resumes'&&row.versions!==undefined)z.array(z.record(z.unknown())).max(20).parse(row.versions);
  const clean={...row};for(const key of ['id','owner','kind','data','updated'])delete clean[key];
  return clean;
}
