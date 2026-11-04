// Corrected review reference: app/search/page.tsx
type Query = Record<string,string|string[]|undefined>;
export default async function Page({searchParams}: {searchParams:Promise<Query>}) {
  const query=await searchParams;
  const term=typeof query.q==='string'?query.q.trim():'';
  return <h1>{term ? 'Results for '+term : 'Enter a search term'}</h1>;
}
