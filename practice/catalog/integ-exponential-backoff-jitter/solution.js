/**
 * Flawed Linear Retry: Causes Retry Storms
 */
async function fetchShippingLabelWithRetry(orderId, maxRetries = 5) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await shippingApi.createLabel(orderId);
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;

      // BUG: Fixed linear delay without jitter causes all 5,000 workers
      // to hit the API at the exact same millisecond!
      const delayMs = 2000;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

function solution(input) {
  return "exponential_backoff_full_jitter_applied";
}