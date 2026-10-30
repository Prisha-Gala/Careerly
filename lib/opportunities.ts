export type Opportunity = {id:string;company:string;title:string;location:string;type:string;deadline:string;requirements:string;url:string;source:string;status:string};
export async function getOpportunities(db:D1Database) {
  const rows=await db.prepare("SELECT id,data FROM records WHERE owner='shared' AND kind='opportunities'").all<any>();
  const today=new Date().toISOString().slice(0,10);
  const opportunities:Opportunity[]=rows.results.flatMap(row=>{
    const data=JSON.parse(row.data);
    return data.status==='Published'&&data.deadline>=today?[{...data,id:row.id,source:'Placement administrator'}]:[];
  });
  return {opportunities,warning:''};
}
