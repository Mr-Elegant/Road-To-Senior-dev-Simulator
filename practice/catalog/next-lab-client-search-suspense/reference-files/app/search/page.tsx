// Corrected review reference: app/search/page.tsx
import { Suspense } from 'react';
import Search from './search-client';
export default function Page(){return <><h1>Search</h1><Suspense fallback={<p>Reading query…</p>}><Search/></Suspense></>;}
