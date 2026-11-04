const reports=new Map();
export async function report(id:string){if(!reports.has(id))reports.set(id,await queryReport(id));return reports.get(id);}