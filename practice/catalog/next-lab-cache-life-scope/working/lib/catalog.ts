import { cacheLife } from 'next/cache';
cacheLife('hours');
export async function getCatalog(){'use cache';return ['one'];}