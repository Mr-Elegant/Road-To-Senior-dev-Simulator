# Reference: Async Promise Concurrency Pool (Worker Throttler)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "code": "function pLimit(concurrency) {\n  const queue = [];\n  let activeCount = 0;\n\n  const next = () => {\n    activeCount--;\n    if (queue.length > 0) {\n      const task = queue.shift();\n      task();\n    }\n  };\n\n  const run = async (fn, resolve, reject, args) => {\n    activeCount++;\n    try {\n      const result = await fn(...args);\n      resolve(result);\n    } catch (err) {\n      reject(err);\n    } finally {\n      next();\n    }\n  };\n\n  const enqueue = (fn, resolve, reject, args) => {\n    queue.push(run.bind(null, fn, resolve, reject, args));\n    if (activeCount < concurrency && queue.length > 0) {\n      const nextTask = queue.shift();\n      nextTask();\n    }\n  };\n\n  const generator = (fn, ...args) =>\n    new Promise((resolve, reject) => {\n      enqueue(fn, resolve, reject, args);\n    });\n\n  return generator;\n}\n\nasync function solution(maxConcurrency) {\n  const limit = pLimit(maxConcurrency);\n  let peakActive = 0;\n  let currentlyActive = 0;\n\n  const tasks = Array.from({ length: 6 }, (_, i) => () => {\n    currentlyActive++;\n    if (currentlyActive > peakActive) peakActive = currentlyActive;\n    return new Promise((r) => setTimeout(() => {\n      currentlyActive--;\n      r(i);\n    }, 10));\n  });\n\n  await Promise.all(tasks.map((t) => limit(t)));\n  return peakActive;\n}",
    "explanation": "Encapsulates a deferred promise executor in a queue with strict decrement in finally blocks, mirroring the industry standard p-limit library.",
    "timeComplexity": "O(1) enqueue/dequeue overhead",
    "spaceComplexity": "O(N) queue storage"
  }
}
```
