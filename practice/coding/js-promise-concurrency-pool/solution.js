/**
 * Implement Promise concurrency limiter
 */
function pLimit(concurrency) {
  const queue = [];
  let activeCount = 0;

  const next = () => {
    if (activeCount < concurrency && queue.length > 0) {
      const task = queue.shift();
      task();
    }
  };

  return function run(fn) {
    return new Promise((resolve, reject) => {
      // TODO: Queue or execute task respecting concurrency bound
      const execute = async () => {
        activeCount++;
        try {
          resolve(await fn());
        } catch (err) {
          reject(err);
        } finally {
          activeCount--;
          next();
        }
      };

      if (activeCount < concurrency) {
        execute();
      } else {
        queue.push(execute);
      }
    });
  };
}

// Verification runner
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