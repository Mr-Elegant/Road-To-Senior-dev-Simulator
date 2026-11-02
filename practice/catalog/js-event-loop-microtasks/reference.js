function processOrderBatch(orders, onOrderProcessed) {
  return new Promise((resolve) => {
    let index = 0;
    const CHUNK_SIZE = 50;

    function processChunk() {
      const limit = Math.min(index + CHUNK_SIZE, orders.length);
      while (index < limit) {
        onOrderProcessed(orders[index++]);
      }

      if (index >= orders.length) {
        resolve('completed');
        return;
      }

      // Yield control to macrotask queue (I/O, health checks, socket events)
      if (typeof setImmediate === 'function') {
        setImmediate(processChunk);
      } else {
        setTimeout(processChunk, 0);
      }
    }

    processChunk();
  });
}
