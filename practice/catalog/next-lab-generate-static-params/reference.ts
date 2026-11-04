// Corrected review reference: app/docs/[slug]/page.tsx
export function generateStaticParams(){return [{slug:'intro'},{slug:'routing'}];}
export default async function Page({params}:{params:Promise<{slug:string}>}){return <h1>{(await params).slug}</h1>;}
