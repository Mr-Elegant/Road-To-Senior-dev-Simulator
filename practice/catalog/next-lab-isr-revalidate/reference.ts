// Corrected review reference: app/news/page.tsx
export default async function Page(){const response=await fetch('https://news.example.com/public',{next:{revalidate:60,tags:['public-news']}});if(!response.ok)throw new Error('News unavailable');return <pre>{await response.text()}</pre>;}
