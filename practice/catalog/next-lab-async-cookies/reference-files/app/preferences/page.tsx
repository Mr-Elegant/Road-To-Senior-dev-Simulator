// Corrected review reference: app/preferences/page.tsx
import { cookies } from 'next/headers';
export default async function Page(){
  const theme=(await cookies()).get('theme')?.value==='dark'?'dark':'light';
  return <p>Preferred theme: {theme}</p>;
}
