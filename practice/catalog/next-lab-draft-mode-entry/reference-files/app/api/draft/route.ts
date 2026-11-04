// Corrected review reference: app/api/draft/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyPreviewRequest } from '@/lib/cms-preview';
export async function GET(request:Request){const preview=await verifyPreviewRequest(request);if(!preview)return new Response('Unauthorized',{status:401});(await draftMode()).enable();redirect(preview.canonicalInternalPath);}
