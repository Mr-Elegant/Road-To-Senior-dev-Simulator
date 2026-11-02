# Reference: Auth Gateway Event-Loop Freezing on CPU-Intensive Hashing

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Node.js runs user JavaScript code on a single thread. When a CPU-intensive synchronous operation like 'bcrypt.compareSync()' or 'crypto.pbkdf2Sync()' executes, the main thread cannot execute any other JavaScript, cannot accept incoming network sockets, cannot respond to HTTP health probes, and cannot fire timers until the hashing calculation finishes.\n      \nFix:\n1. Replace 'bcrypt.compareSync()' with asynchronous 'await bcrypt.compare()'. This offloads the cryptographic computation to the C++ libuv thread pool.\n2. Note that the default libuv thread pool has only 4 threads. If 10 requests arrive concurrently, 4 run in parallel and 6 wait in the thread pool queue. For crypto-intensive services, configure 'UV_THREADPOOL_SIZE=16' or '32' via environment variable before the Node.js process starts, or offload auth hashing to dedicated worker threads / external auth service (e.g. Auth0 / Cognito).",
    "codeOrArtifact": "const bcrypt = require('bcrypt');\n\n// In entrypoint script before any async I/O:\n// process.env.UV_THREADPOOL_SIZE = '16';\n\nasync function verifyUserLogin(plainPassword, passwordHash) {\n  // Offloads hashing calculation to libuv background thread pool\n  return await bcrypt.compare(plainPassword, passwordHash);\n}"
  },
  "rubric": [
    {
      "id": "rb-libuv-pool",
      "category": "root_cause",
      "label": "Node.js Event Loop & libuv Thread Pool Architecture",
      "description": "Explains libuv worker pool offloading, thread contention, and event loop latency.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Details V8 single thread vs libuv pool, UV_THREADPOOL_SIZE limits, and async compare."
        },
        {
          "score": 2,
          "description": "Switches to async compare but unaware of UV_THREADPOOL_SIZE bottleneck."
        },
        {
          "score": 0,
          "description": "Unaware of event-loop blocking."
        }
      ]
    }
  ],
  "alternatives": [
    "Offloading hashing to a dedicated microservice or Node.js Worker Threads (`worker_threads`).",
    "Using Argon2id with WebAssembly / C bindings tuned for low iteration count and higher memory cost."
  ],
  "commonMistakes": [
    "Setting process.env.UV_THREADPOOL_SIZE after modules have already made async calls (libuv initializes the pool once and ignores later changes).",
    "Thinking Promise.resolve().then(() => bcrypt.compareSync(...)) makes it non-blocking (it still runs synchronously on the main thread)."
  ],
  "followUps": [
    {
      "id": "node-fq-1",
      "question": "What types of operations use the libuv thread pool in Node.js?",
      "expectedConcepts": [
        "fs (filesystem operations)",
        "crypto (pbkdf2, scrypt, randomBytes)",
        "zlib (compression)",
        "dns.lookup (getaddrinfo)"
      ],
      "sampleStrongAnswer": "The libuv thread pool handles operations that have blocking OS system calls without asynchronous non-blocking OS APIs: filesystem operations (`fs`), cryptographic calculations (`crypto`), compression (`zlib`), and DNS lookups via OS `getaddrinfo` (`dns.lookup`). Network sockets (`net`, `http`) do NOT use the thread pool; they use non-blocking epoll/kqueue."
    }
  ]
}
```
