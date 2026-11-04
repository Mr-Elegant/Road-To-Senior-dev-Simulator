// Corrected review reference: lib/catalog.ts
import { cacheLife } from 'next/cache';
export async function getCatalog(){'use cache';cacheLife({stale:60,revalidate:300,expire:3600});return ['one'];}
