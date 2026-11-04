export const runtime='edge';
import fs from 'node:fs/promises';
export async function GET(){return new Response(await fs.readFile('/tmp/report','utf8'));}