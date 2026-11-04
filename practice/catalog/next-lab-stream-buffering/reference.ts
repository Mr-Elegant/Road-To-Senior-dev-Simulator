// Corrected review reference: app/api/report/route.ts
import { createReportStream } from '@/lib/reports';
export async function GET(request:Request){const stream=await createReportStream(request.signal);return new Response(stream,{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store','X-Accel-Buffering':'no'}});}
// createReportStream returns a bounded Web ReadableStream and honors cancellation.
// Configure and verify the actual reverse proxy/CDN; this header is not a universal buffering override.
