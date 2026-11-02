/**
 * Buggy Flash-Sale Ingestion Worker
 * Processes order batches recursively using chained microtasks.
 */
function processOrderBatch(orders, onOrderProcessed) {
  let index = 0;
  
  function step() {
    if (index >= orders.length) return Promise.resolve('completed');
    
    const order = orders[index++];
    onOrderProcessed(order);
    
    // BUG: Chaining unresolved microtasks recursively starves the Macrotask Queue (I/O, Timers)!
    return Promise.resolve().then(step);
  }
  
  return step();
}

// Simulated export for test runner
function solution(orderCount) {
  const orders = Array.from({ length: orderCount }, (_, i) => ({ id: i + 1, total: 99.99 }));
  let processed = 0;
  
  // Return how you cooperatively yield to the event loop macrotask queue every N iterations
  return processOrderBatch(orders, () => { processed++; });
}