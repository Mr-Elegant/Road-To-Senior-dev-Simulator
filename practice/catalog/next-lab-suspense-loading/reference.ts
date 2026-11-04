// Corrected review reference: app/reports/page.tsx
import { Suspense } from 'react';
async function Report(){await new Promise(resolve=>setTimeout(resolve,800));return <p>Report ready</p>;}
export default function Page(){return <><h1>Reports</h1><Suspense fallback={<p role="status">Loading report</p>}><Report/></Suspense></>;}
