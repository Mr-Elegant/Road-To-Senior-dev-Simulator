export function generateStaticParams(){return [{id:'intro'}];}
export default async function Page({params}:{params:Promise<{slug:string}>}){return <h1>{(await params).slug}</h1>;}