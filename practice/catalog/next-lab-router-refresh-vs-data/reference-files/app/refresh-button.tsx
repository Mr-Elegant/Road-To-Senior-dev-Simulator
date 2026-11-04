// Corrected review reference: app/refresh-button.tsx
'use client';
import { useRouter } from 'next/navigation';
export default function Refresh(){const router=useRouter();return <button onClick={()=>router.refresh()}>Request updated server UI</button>;}
// The mutation boundary must separately revalidate affected server data when required.
