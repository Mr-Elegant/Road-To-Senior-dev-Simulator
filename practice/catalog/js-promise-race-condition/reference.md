# Reference: Multi-Tab Wallet Checkout Balance Debit Race Condition

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "An asynchronous keyed mutex coordinates tasks by maintaining a promise chain per key. When a new task arrives:\n1. We retrieve the previous tail promise for that key (or Promise.resolve() if idle).\n2. We chain the new task after the previous promise finishes (using .then or .finally so rejection doesn't break the chain).\n3. We store the new tail in the map.\n4. When the tail resolves and no further tasks are waiting, we delete the key from the map to prevent memory leaks.",
    "codeOrArtifact": "class AsyncKeyedMutex {\n  constructor() {\n    this.locks = new Map();\n  }\n\n  async runExclusive(key, task) {\n    const previous = this.locks.get(key) || Promise.resolve();\n\n    let release;\n    const currentLock = new Promise((resolve) => {\n      release = resolve;\n    });\n\n    this.locks.set(key, currentLock);\n\n    try {\n      await previous;\n      return await task();\n    } finally {\n      release();\n      if (this.locks.get(key) === currentLock) {\n        this.locks.delete(key);\n      }\n    }\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-mutex-correctness",
      "category": "correctness",
      "label": "Serialization & Exclusivity",
      "description": "Tasks with matching keys execute in strict sequence without overlap.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Strict sequential execution with complete isolation between different keys."
        },
        {
          "score": 2,
          "description": "Serializes correctly but fails if task throws an error."
        },
        {
          "score": 1,
          "description": "Attempts boolean flag which fails across async tick pauses."
        },
        {
          "score": 0,
          "description": "No serialization achieved."
        }
      ]
    },
    {
      "id": "rb-cleanup-keys",
      "category": "reliability",
      "label": "Lock Table Memory Cleanliness",
      "description": "Map entries are deleted once all pending tasks complete.",
      "weight": 4,
      "levels": [
        {
          "score": 3,
          "description": "Deletes key from map when queue is drained."
        },
        {
          "score": 2,
          "description": "Leaves dead resolved promises in Map indefinitely."
        },
        {
          "score": 0,
          "description": "Unbounded memory leak."
        }
      ]
    }
  ],
  "alternatives": [
    "FIFO Array queue of defer resolvers with an active worker loop.",
    "Distributed Redis Redlock / optimistic concurrency token on the server side (crucial for multi-server setups)."
  ],
  "commonMistakes": [
    "Using a simple boolean flag: between the check and the async operation, another invocation enters.",
    "Uncaught exceptions in task 1 causing task 2 to hang forever because release() is not in a finally block."
  ],
  "followUps": [
    {
      "id": "js-fq-3",
      "question": "Why is client-side mutex locking insufficient on its own for preventing double spending in payments?",
      "expectedConcepts": [
        "Bypass via curl / Postman",
        "Network retries and multi-device access",
        "Database transaction row lock required"
      ],
      "sampleStrongAnswer": "Client-side locking only protects against user UI duplicate clicks or multi-tab races in the same browser. It cannot prevent direct API abuse via curl, concurrent requests from different mobile devices, or network duplicate deliveries. True financial safety requires database-level transactional locks (SELECT FOR UPDATE) and idempotent request keys in Redis or PostgreSQL."
    }
  ]
}
```
