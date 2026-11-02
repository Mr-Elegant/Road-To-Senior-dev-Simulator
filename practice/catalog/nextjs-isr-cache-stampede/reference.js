const inFlightRevalidations = new Map();

export async function fetchCatalogDataDeduplicated(productId) {
  // Check if a revalidation is already in progress in this instance
  if (inFlightRevalidations.has(productId)) {
    return inFlightRevalidations.get(productId);
  }

  const fetchPromise = (async () => {
    try {
      // In production, acquire Redis lock: SET lock:product:{id} true NX PX 5000
      return await queryDatabase(productId);
    } finally {
      inFlightRevalidations.delete(productId);
    }
  })();

  inFlightRevalidations.set(productId, fetchPromise);
  return fetchPromise;
}
