// Corrected review reference: pages/posts/[slug].tsx
import type { GetStaticPaths,GetStaticProps,InferGetStaticPropsType } from 'next';
export const getStaticPaths=(async()=>({paths:[{params:{slug:'intro'}}],fallback:'blocking'})) satisfies GetStaticPaths;
export const getStaticProps=(async({params})=>{const slug=typeof params?.slug==='string'?params.slug:'';if(!slug)return {notFound:true};return {props:{slug},revalidate:60};}) satisfies GetStaticProps<{slug:string}>;
export default function Page({slug}:InferGetStaticPropsType<typeof getStaticProps>){return <h1>{slug}</h1>;}
