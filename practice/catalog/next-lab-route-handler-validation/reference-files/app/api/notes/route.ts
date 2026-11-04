// Corrected review reference: app/api/notes/route.ts
export async function POST(request:Request){
 if(request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!=='application/json')return Response.json({error:'Unsupported media type'},{status:415});
 let body:unknown;try{body=await request.json();}catch{return Response.json({error:'Invalid JSON'},{status:400});}
 if(!body||typeof body!=='object'||!('title' in body)||typeof body.title!=='string'||!body.title.trim()||body.title.length>80)return Response.json({error:'Invalid title'},{status:422});
 return Response.json({title:body.title.trim()},{status:201});
}
// Add authentication, transport body limits and persistence before treating this echo as a write endpoint.
