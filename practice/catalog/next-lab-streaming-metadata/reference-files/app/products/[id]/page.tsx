// Corrected review reference: app/products/[id]/page.tsx
import { getPublicProduct } from '@/lib/public-product';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const product=await getPublicProduct(id);return {title:product.title,description:product.summary};}
export default async function Page({params}:{params:Promise<{id:string}>}){const product=await getPublicProduct((await params).id);return <h1>{product.title}</h1>;}
