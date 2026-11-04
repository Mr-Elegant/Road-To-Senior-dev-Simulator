// Corrected review reference: app/request-id/page.tsx
import { Suspense } from 'react';
import { connection } from 'next/server';
async function RequestId(){await connection();return <p>{crypto.randomUUID()}</p>;}
export default function Page(){return <Suspense fallback={<p>Creating request identifier</p>}><RequestId/></Suspense>;}
