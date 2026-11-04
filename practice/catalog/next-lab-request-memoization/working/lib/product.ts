const cache=new Map<string,unknown>();
export async function getProduct(id:string){if(!cache.has(id))cache.set(id,await loadFromDatabase(id));return cache.get(id);}