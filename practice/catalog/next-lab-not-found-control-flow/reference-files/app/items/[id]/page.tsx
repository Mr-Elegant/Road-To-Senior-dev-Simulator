// Corrected review reference: app/items/[id]/page.tsx
import { notFound } from 'next/navigation';
const items:Record<string,{title:string}>={one:{title:'First item'}};
export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params; const item=items[id];
  if(!item)notFound();
  return <h1>{item.title}</h1>;
}
