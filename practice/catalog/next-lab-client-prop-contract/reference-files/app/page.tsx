// Corrected review reference: app/page.tsx
// app/page.tsx (Server Component)
import Button from './button';
export default function Page(){ return <Button label="Save draft" />; }
// app/button.tsx is a separate file:
// 'use client';
// export default function Button({label}:{label:string}) {
//   return <button onClick={()=>console.log('clicked')}>{label}</button>;
// }
