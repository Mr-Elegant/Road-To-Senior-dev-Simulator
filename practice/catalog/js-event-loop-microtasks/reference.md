# Reference: Flash-Sale Batch Processor Microtask Queue Starvation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Microtasks (Promise callbacks, process.nextTick, queueMicrotask) run at the end of the current macrotask tick and will continue draining until the microtask queue is completely exhausted. In the original code, step() queues another Promise.resolve().then(step) recursively. This keeps the microtask queue non-empty forever while orders remain, starving the event loop from ever reaching the Poll phase (where incoming TCP socket data and health checks are accepted) or Timers phase (where WebSocket ping timeouts fire).\n      \nFix: Implement cooperative chunking. Process in chunks (e.g. 50 orders) or check if time elapsed exceeds a budget (e.g. 10ms). When the budget expires, schedule the continuation using setImmediate (Node.js) or setTimeout(step, 0) / MessageChannel (browser), allowing the event loop to service socket I/O and timer events before resuming order processing.",
    "codeOrArtifact": "function processOrderBatch(orders, onOrderProcessed) {\n  return new Promise((resolve) => {\n    let index = 0;\n    const CHUNK_SIZE = 50;\n\n    function processChunk() {\n      const limit = Math.min(index + CHUNK_SIZE, orders.length);\n      while (index < limit) {\n        onOrderProcessed(orders[index++]);\n      }\n\n      if (index >= orders.length) {\n        resolve('completed');\n        return;\n      }\n\n      // Yield control to macrotask queue (I/O, health checks, socket events)\n      if (typeof setImmediate === 'function') {\n        setImmediate(processChunk);\n      } else {\n        setTimeout(processChunk, 0);\n      }\n    }\n\n    processChunk();\n  });\n}"
  },
  "rubric": [
    {
      "id": "rb-root-cause",
      "category": "root_cause",
      "label": "Event Loop & Microtask Queue Starvation Understanding",
      "description": "Understands that microtask queue empties completely before macrotask queue (I/O) is processed.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Clearly explains microtask starvation semantics and how it suffocated TCP ping/pong macrotasks."
        },
        {
          "score": 2,
          "description": "Identifies that Promise recursion is the issue but vague on macrotask vs microtask phase transitions."
        },
        {
          "score": 1,
          "description": "Thinks the code is simply running out of memory or needs multithreading."
        },
        {
          "score": 0,
          "description": "Fails to identify asynchronous event loop mechanics."
        }
      ]
    },
    {
      "id": "rb-correctness",
      "category": "correctness",
      "label": "Cooperative Scheduling Implementation",
      "description": "Implements yield pattern with setImmediate / setTimeout / MessageChannel without stack overflow.",
      "weight": 4,
      "levels": [
        {
          "score": 3,
          "description": "Yields every N items or using performance.now() budget cleanly."
        },
        {
          "score": 2,
          "description": "Yields on every single item causing high timer overhead."
        },
        {
          "score": 1,
          "description": "Replaces with synchronous for-loop which still blocks the thread."
        },
        {
          "score": 0,
          "description": "Fails to implement cooperative scheduling."
        }
      ]
    },
    {
      "id": "rb-tradeoffs",
      "category": "tradeoffs",
      "label": "Performance & Latency Trade-offs",
      "description": "Balances per-item throughput against latency for concurrent socket I/O.",
      "weight": 3,
      "levels": [
        {
          "score": 3,
          "description": "Analyzes batch chunk size (e.g. 50-100 items per tick) vs event-loop delay."
        },
        {
          "score": 2,
          "description": "Mentions chunking but does not provide operational trade-offs."
        },
        {
          "score": 1,
          "description": "Does not consider latency impact."
        },
        {
          "score": 0,
          "description": "No analysis provided."
        }
      ]
    }
  ],
  "alternatives": [
    "Using Async Generators with for-await-of loop and time-budgeted yields.",
    "Offloading heavy batch ingestion to Node.js Worker Threads (worker_threads) with SharedArrayBuffer or message passing."
  ],
  "commonMistakes": [
    "Replacing Promise.resolve().then() with setImmediate on every single item, introducing 100x timer bookkeeping overhead.",
    "Converting to a synchronous while loop, which freezes the event loop completely for seconds.",
    "Using process.nextTick(), which is even more aggressive than Promises and immediately crashes process health checks."
  ],
  "followUps": [
    {
      "id": "js-fq-1",
      "question": "What is the priority difference between process.nextTick() and Promise.then() in Node.js?",
      "expectedConcepts": [
        "nextTickQueue takes priority over Promise microtask queue",
        "process.nextTick runs immediately after the current operation before any other microtasks"
      ],
      "sampleStrongAnswer": "In Node.js, process.nextTick() has its own nextTickQueue which is processed immediately after the current operation finishes, before the Promise microtask queue. Excessive recursive nextTick calls will starve Promises, whereas Promise.resolve().then uses the standard microtask queue."
    }
  ]
}
```
