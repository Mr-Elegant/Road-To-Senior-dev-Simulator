async function fetchWithFullJitter(fetchFn, maxRetries = 5, baseMs = 500, capMs = 20000) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fetchFn();
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;

      // Check for upstream Retry-After header (seconds)
      const retryAfterHeader = err.response?.headers?.['retry-after'];
      let delayMs;

      if (retryAfterHeader) {
        const seconds = parseInt(retryAfterHeader, 10);
        delayMs = (!isNaN(seconds) ? seconds * 1000 : baseMs) + Math.random() * 500;
      } else {
        // Exponential Backoff with Full Jitter
        const exponentialMax = Math.min(capMs, baseMs * Math.pow(2, attempt));
        delayMs = Math.floor(Math.random() * exponentialMax);
      }

      console.warn(`Attempt ${attempt} failed. Retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}
