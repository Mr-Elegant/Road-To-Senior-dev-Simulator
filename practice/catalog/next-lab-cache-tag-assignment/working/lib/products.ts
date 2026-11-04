import { cacheTag } from 'next/cache';
export async function product(id:string){'use cache';cacheTag('products');return {id};}
// Mutation invalidates product:<id>, a tag never assigned above.