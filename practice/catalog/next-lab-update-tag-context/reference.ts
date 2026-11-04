// Corrected review reference: app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { authorizeRevalidation } from '@/lib/revalidation-auth';
export async function POST(request:Request){await authorizeRevalidation(request);revalidateTag('products',{expire:0});return Response.json({ok:true});}
