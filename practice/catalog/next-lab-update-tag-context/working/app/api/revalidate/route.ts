import { updateTag } from 'next/cache';
export async function POST(){updateTag('products');return Response.json({ok:true});}