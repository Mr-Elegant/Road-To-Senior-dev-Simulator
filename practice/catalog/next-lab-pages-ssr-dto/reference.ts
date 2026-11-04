// Corrected review reference: pages/account.tsx
import type { GetServerSideProps,InferGetServerSidePropsType } from 'next';
export const getServerSideProps=(async()=>({props:{generatedAt:new Date().toISOString()}})) satisfies GetServerSideProps<{generatedAt:string}>;
export default function Page({generatedAt}:InferGetServerSidePropsType<typeof getServerSideProps>){return <p>Generated: {generatedAt}</p>;}
