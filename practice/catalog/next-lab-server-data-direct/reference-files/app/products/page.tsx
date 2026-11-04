// Corrected review reference: app/products/page.tsx
import { listPublicProducts } from '@/lib/products';
export default async function Page(){const products=await listPublicProducts();return <ul>{products.map(product=><li key={product.id}>{product.name}</li>)}</ul>;}
// lib/products is server-only and returns an allowlisted public product DTO.
