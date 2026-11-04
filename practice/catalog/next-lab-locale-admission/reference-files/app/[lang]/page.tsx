// Corrected review reference: app/[lang]/page.tsx
import { notFound } from 'next/navigation';
const dictionaries={en:async()=>({title:'Welcome'}),hi:async()=>({title:'Namaste'})};
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(lang!=='en'&&lang!=='hi')notFound();const dictionary=await dictionaries[lang]();return <h1>{dictionary.title}</h1>;}
