// Corrected review reference: lib/products.ts
import { cacheTag,cacheLife } from 'next/cache';
export async function product(id:string){'use cache';cacheLife('minutes');cacheTag('products','product:'+id);return {id};}
