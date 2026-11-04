import { ImageResponse } from 'next/og';
export default function Icon({id}:{id:string}){return new ImageResponse(<div>{id}</div>,{width:64,height:64});}