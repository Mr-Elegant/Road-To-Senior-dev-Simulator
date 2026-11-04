// Corrected review reference: lib/public-catalog.ts
export async function getCatalog(){const response=await fetch('https://catalog.example.com/public',{cache:'force-cache',next:{tags:['public-catalog']}});if(!response.ok)throw new Error('Catalog unavailable');return response.json();}
