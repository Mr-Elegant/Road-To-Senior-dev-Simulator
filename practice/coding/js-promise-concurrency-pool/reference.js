function pLimit(concurrency) {
  const queue = [];
  let activeCount = 0;

  const next = () => {
    activeCount--;
    if (queue.length > 0) {
      const task = queue.shift();
      task();
    }
  };

  const run = async (fn, resolve, reject, args) => {
    activeCount++;
    try {
      const result = await fn(...args);
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      next();
    }
  };

  const enqueue = (fn, resolve, reject, args) => {
    queue.push(run.bind(null, fn, resolve, reject, args));
    if (activeCount < concurrency && queue.length > 0) {
      const nextTask = queue.shift();
      nextTask();
    }
  };

  const generator = (fn, ...args) =>
    new Promise((resolve, reject) => {
      enqueue(fn, resolve, reject, args);
    });

  return generator;
}

async function solution(maxConcurrency) {
  const limit = pLimit(maxConcurrency);
  let peakActive = 0;
  let currentlyActive = 0;

  const tasks = Array.from({ length: 6 }, (_, i) => () => {
    currentlyActive++;
    if (currentlyActive > peakActive) peakActive = currentlyActive;
    return new Promise((r) => setTimeout(() => {
      currentlyActive--;
      r(i);
    }, 10));
  });

  await Promise.all(tasks.map((t) => limit(t)));
  return peakActive;
}
