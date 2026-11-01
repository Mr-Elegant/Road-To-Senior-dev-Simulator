import { AccessError } from './server';

export async function readBoundedJson(request: Request, limit = 100000, allowEmpty = false): Promise<unknown> {
  if (!request.body) {
    if (allowEmpty) return undefined;
    throw new AccessError(400, 'Missing JSON payload.');
  }
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.byteLength;
    if (size > limit) { void reader.cancel().catch(() => {}); throw new AccessError(413, 'Request payload is too large.'); }
    chunks.push(chunk.value);
  }
  if (size === 0 && allowEmpty) return undefined;
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new AccessError(400, 'Invalid JSON payload.'); }
}
