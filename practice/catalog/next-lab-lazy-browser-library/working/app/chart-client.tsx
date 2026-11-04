import dynamic from 'next/dynamic';
const Chart=dynamic(()=>import('./browser-chart'),{ssr:false});
export default function Page(){return <Chart/>;}