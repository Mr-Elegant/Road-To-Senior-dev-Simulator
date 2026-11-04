// Corrected review reference: app/dashboard/error.tsx
'use client';
export default function ErrorBoundary({reset}:{error:Error&{digest?:string};reset:()=>void}){
  return <section role="alert"><h2>Dashboard unavailable</h2><p>Try again in a moment.</p><button onClick={()=>reset()}>Retry</button></section>;
}
