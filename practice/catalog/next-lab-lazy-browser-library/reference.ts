// Corrected review reference: app/chart-client.tsx
'use client';
import dynamic from 'next/dynamic';
const Chart=dynamic(()=>import('./browser-chart'),{ssr:false,loading:()=> <p role="status">Loading chart</p>});
export default function ChartClient(){return <Chart/>;}
// Render ChartClient from a server page; keep data fetching in the server layer.
