import { Suspense } from 'react';
export default async function Page(){ await new Promise(r=>setTimeout(r,800)); return <Suspense fallback={<p>Loading</p>}><p>Report ready</p></Suspense>; }