// Corrected review reference: app/@modal/(.)photo/[id]/close.tsx
'use client';
import { useRouter } from 'next/navigation';
export default function Close(){const router=useRouter();return <button type="button" onClick={()=>router.back()}>Close photo</button>;}
// The full-page photo route and @modal/default.tsx remain separate route files.
