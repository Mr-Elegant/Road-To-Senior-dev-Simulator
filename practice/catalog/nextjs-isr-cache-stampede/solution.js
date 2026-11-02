/**
 * ISR Route Segment Config & Cache Fetcher
 */
// export const revalidate = 60; // 60 seconds ISR

export async function fetchCatalogData(productId) {
  // BUG: When cache expires under 10,000 rps, 10,000 workers all execute
  // this heavy DB query in parallel because there is no single-flight lock!
  console.log("CACHE MISS: Querying PostgreSQL for product:", productId);
  
  // Heavy database query taking 450ms
  return queryDatabase(productId);
}

async function queryDatabase(id) {
  return { id, title: "Limited Edition Jacket", stock: 45 };
}

function solution(input) {
  return "single_flight_deduplicated";
}