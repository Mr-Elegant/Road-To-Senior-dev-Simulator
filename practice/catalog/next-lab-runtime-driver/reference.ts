// Corrected review reference: app/api/report/route.ts
export const runtime='nodejs';
import { readFile } from 'node:fs/promises';
export async function GET(){try{return new Response(await readFile('/tmp/report','utf8'),{headers:{'Cache-Control':'private, no-store'}});}catch{return Response.json({error:'Report unavailable'},{status:503});}}
