/**
 * Async Mutex / Keyed Serialization Lock
 * Prevents concurrent operations on the same entity.
 */
class AsyncKeyedMutex {
  constructor() {
    this.locks = new Map();
  }

  async runExclusive(key, task) {
    // TODO: Implement queue serialization per key
    // Ensure task() runs exclusively for 'key'
    return task();
  }
}

// Test harness verification
function solution(inputs) {
  const mutex = new AsyncKeyedMutex();
  const logs = [];
  
  const p1 = mutex.runExclusive("user-1", async () => {
    logs.push("start-1");
    await new Promise((r) => setTimeout(r, 10));
    logs.push("end-1");
    return 1;
  });

  const p2 = mutex.runExclusive("user-1", async () => {
    logs.push("start-2");
    logs.push("end-2");
    return 2;
  });

  return Promise.all([p1, p2]).then(() => JSON.stringify(logs));
}