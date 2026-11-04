// Corrected review reference: app/icon.tsx
import { ImageResponse } from 'next/og';
export function generateImageMetadata(){return [{id:'primary',size:{width:64,height:64},contentType:'image/png'}];}
export default async function Icon({id}:{id:Promise<string>}){const variant=await id;return new ImageResponse(<div style={{display:'flex',fontSize:20}}>{variant==='primary'?'P':'?'}</div>,{width:64,height:64});}
