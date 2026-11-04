// Corrected review reference: app/products/page.tsx
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { cacheLife } from 'next/cache';
async function CachedCatalog({tenant}:{tenant:string}){'use cache';cacheLife('minutes');return <p>Public catalog partition: {tenant}</p>;}
async function TenantCatalog(){const tenant=(await cookies()).get('tenant')?.value||'public';return <CachedCatalog tenant={tenant}/>;}
export default function Page(){return <Suspense fallback={<p>Loading tenant catalog</p>}><TenantCatalog/></Suspense>;}
