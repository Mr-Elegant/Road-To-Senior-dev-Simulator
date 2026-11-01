import { Scenario } from '@/types/scenario';

export const nodejsScenarios: Scenario[] = [
  {
    id: 'nodejs-event-loop-blocking-crypto',
    title: 'Auth Gateway Event-Loop Freezing on CPU-Intensive Hashing',
    type: 'debugging',
    topic: 'Node.js',
    subtopic: 'Event-loop blocking',
    difficulty: 'Senior',
    estimatedMinutes: 25,
    businessContext:
      'During morning peak login hours (9:00 AM), an enterprise SSO authentication gateway suffers massive latency spikes. Simple GET `/health` probes jump from 2ms to 8,000ms, and ALB load balancers take instances out of service, causing cascading outages.',
    problemStatement:
      'The password verification endpoint used synchronous `bcrypt.compareSync(password, hash)` with 14 salt rounds. Because Node.js is single-threaded on its JavaScript main thread, each synchronous hash blocks the entire event loop for 350ms. With 20 concurrent logins, all other incoming HTTP connections and TCP keep-alives are queued and frozen for over 7 seconds.',
    constraints: [
      'Must eliminate main event-loop blocking.',
      'Must maintain high password hashing security parameters (e.g. bcrypt work factor 12-14 or Argon2id).',
      'Event loop lag during concurrent logins must stay under 25ms.',
    ],
    starterCode: `const bcrypt = require('bcrypt');

/**
 * Buggy Auth Route: Blocks Node.js Main Event Loop
 */
function verifyUserLogin(plainPassword, passwordHash) {
  // BUG: Synchronous CPU-bound hashing freezes the entire V8 single thread!
  const isMatch = bcrypt.compareSync(plainPassword, passwordHash);
  return isMatch;
}

function solution(input) {
  return "non_blocking_async_libuv";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain how `bcrypt.compareSync` blocks the V8 thread vs how `bcrypt.compare` utilizes the libuv worker pool.',
      'Refactor to asynchronous `await bcrypt.compare(plainPassword, passwordHash)`.',
      'Explain the default size of `UV_THREADPOOL_SIZE` (4) and how to tune it for crypto-heavy Node applications.',
    ],
    hints: [
      'Synchronous crypto functions block the Node.js main thread completely.',
      'Asynchronous crypto operations in Node.js are offloaded to libuv background thread pool (default 4 threads).',
      'Set `process.env.UV_THREADPOOL_SIZE = 16` before starting the process if handling high concurrent crypto loads.',
    ],
    testCases: [
      {
        id: 'tc-crypto-1',
        name: 'Uses libuv asynchronous thread pool without blocking event loop',
        inputDescription: 'null',
        expectedOutput: '"non_blocking_async_libuv"',
        explanation: 'Offloads CPU-intensive hashing to background worker threads.',
      },
    ],
    rubric: [
      {
        id: 'rb-libuv-pool',
        category: 'root_cause',
        label: 'Node.js Event Loop & libuv Thread Pool Architecture',
        description: 'Explains libuv worker pool offloading, thread contention, and event loop latency.',
        weight: 5,
        levels: [
          { score: 3, description: 'Details V8 single thread vs libuv pool, UV_THREADPOOL_SIZE limits, and async compare.' },
          { score: 2, description: 'Switches to async compare but unaware of UV_THREADPOOL_SIZE bottleneck.' },
          { score: 0, description: 'Unaware of event-loop blocking.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Node.js runs user JavaScript code on a single thread. When a CPU-intensive synchronous operation like 'bcrypt.compareSync()' or 'crypto.pbkdf2Sync()' executes, the main thread cannot execute any other JavaScript, cannot accept incoming network sockets, cannot respond to HTTP health probes, and cannot fire timers until the hashing calculation finishes.
      
Fix:
1. Replace 'bcrypt.compareSync()' with asynchronous 'await bcrypt.compare()'. This offloads the cryptographic computation to the C++ libuv thread pool.
2. Note that the default libuv thread pool has only 4 threads. If 10 requests arrive concurrently, 4 run in parallel and 6 wait in the thread pool queue. For crypto-intensive services, configure 'UV_THREADPOOL_SIZE=16' or '32' via environment variable before the Node.js process starts, or offload auth hashing to dedicated worker threads / external auth service (e.g. Auth0 / Cognito).`,
      codeOrArtifact: `const bcrypt = require('bcrypt');

// In entrypoint script before any async I/O:
// process.env.UV_THREADPOOL_SIZE = '16';

async function verifyUserLogin(plainPassword, passwordHash) {
  // Offloads hashing calculation to libuv background thread pool
  return await bcrypt.compare(plainPassword, passwordHash);
}`,
    },
    alternativeApproaches: [
      'Offloading hashing to a dedicated microservice or Node.js Worker Threads (`worker_threads`).',
      'Using Argon2id with WebAssembly / C bindings tuned for low iteration count and higher memory cost.',
    ],
    commonMistakes: [
      'Setting process.env.UV_THREADPOOL_SIZE after modules have already made async calls (libuv initializes the pool once and ignores later changes).',
      'Thinking Promise.resolve().then(() => bcrypt.compareSync(...)) makes it non-blocking (it still runs synchronously on the main thread).',
    ],
    followUpQuestions: [
      {
        id: 'node-fq-1',
        question: 'What types of operations use the libuv thread pool in Node.js?',
        expectedConcepts: ['fs (filesystem operations)', 'crypto (pbkdf2, scrypt, randomBytes)', 'zlib (compression)', 'dns.lookup (getaddrinfo)'],
        sampleStrongAnswer: 'The libuv thread pool handles operations that have blocking OS system calls without asynchronous non-blocking OS APIs: filesystem operations (`fs`), cryptographic calculations (`crypto`), compression (`zlib`), and DNS lookups via OS `getaddrinfo` (`dns.lookup`). Network sockets (`net`, `http`) do NOT use the thread pool; they use non-blocking epoll/kqueue.',
      },
    ],
  },
  {
    id: 'nodejs-express-error-middleware',
    title: 'Express Asynchronous Error Swallowing & Hanging Socket Leak',
    type: 'debugging',
    topic: 'Node.js',
    subtopic: 'Express middleware',
    difficulty: 'Senior',
    estimatedMinutes: 20,
    businessContext:
      'In an Express.js REST API handling merchant inventory updates, when an unexpected database constraint error occurs inside an async route handler, the client request hangs indefinitely until hitting a 60-second gateway timeout. Over time, open socket handles accumulate, exhausting file descriptors.',
    problemStatement:
      'Express 4 does not automatically catch rejected promises returned from `async (req, res, next)` route handlers. When an unhandled error throws inside an async function without an explicit `next(err)` or wrapper, Express never sends an HTTP response, leaving the client socket hanging open.',
    constraints: [
      'Must guarantee every rejected promise in route handlers is caught and passed to global error middleware.',
      'Must return consistent RFC 7807 Problem Details JSON format `{ status: 500, title, detail }`.',
      'Prevent socket handle and file descriptor exhaustion.',
    ],
    starterCode: `const express = require('express');
const app = express();

/**
 * Buggy Express Route Handler
 */
app.post('/api/inventory/update', async (req, res, next) => {
  // BUG: Express 4 does not catch errors thrown in unhandled async functions!
  // If updateInventory throws, this promise rejects, next(err) is never called,
  // and the HTTP connection hangs until client timeout.
  const result = await db.updateInventory(req.body);
  res.json({ success: true, result });
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

function solution(input) {
  return "async_handler_wrapped";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain why Express 4 fails to catch rejected promises in async middleware.',
      'Implement an `asyncHandler` higher-order function that wraps async routes with `.catch(next)`.',
      'Discuss how Express 5 natively handles rejected promises.',
    ],
    hints: [
      'Express 4 route handlers expect synchronous code or explicit `next(err)` invocations.',
      'Create a wrapper: `const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)`.',
    ],
    testCases: [
      {
        id: 'tc-exp-1',
        name: 'Catches async exceptions and routes to global error handler',
        inputDescription: 'null',
        expectedOutput: '"async_handler_wrapped"',
        explanation: 'Guarantees proper response termination on async exceptions.',
      },
    ],
    rubric: [
      {
        id: 'rb-async-handler',
        category: 'reliability',
        label: 'Express Async Error Handling Mechanics',
        description: 'Implements asyncHandler wrapper or Express 5 upgrade to guarantee catch(next).',
        weight: 5,
        levels: [
          { score: 3, description: 'Writes robust asyncHandler wrapper, explains Express 4 vs 5 difference and socket leak risk.' },
          { score: 2, description: 'Adds try/catch inside individual route but does not create reusable middleware pattern.' },
          { score: 0, description: 'Fails to address async rejection.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `In Express 4, route handlers were designed around the traditional callback pattern (err, result). When you pass an 'async (req, res, next)' function to Express 4, Express executes it synchronously and ignores the returned Promise. If an exception is thrown after an 'await', the promise rejects. Because nothing catches the promise rejection, 'next(err)' is never called, and 'res.send()' is never executed. The client TCP connection remains open until timeout.
      
Fix:
Wrap async handlers in an 'asyncHandler' utility:
'const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);'
Or upgrade to Express 5, where route handlers automatically forward rejected promises to 'next(err)'.`,
      codeOrArtifact: `/**
 * Higher-order utility wrapping async handlers to forward rejections to next(err)
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage:
// app.post('/api/inventory/update', asyncHandler(async (req, res) => {
//   const result = await db.updateInventory(req.body);
//   res.json({ success: true, result });
// }));`,
    },
    alternativeApproaches: [
      'Upgrading to Express 5 or migrating to Fastify / Koa (which have native promise support).',
      'Using `express-async-errors` package (monkey-patches Layer.prototype.handle_request).',
    ],
    commonMistakes: [
      'Writing manual try/catch in every single route handler (repetitive and prone to human omission).',
      'Placing the 4-argument error middleware `(err, req, res, next)` BEFORE route definitions (it must be registered last).',
    ],
    followUpQuestions: [
      {
        id: 'node-fq-2',
        question: 'Why must Express error-handling middleware have exactly 4 arguments `(err, req, res, next)`?',
        expectedConcepts: ['Function.prototype.length reflection', 'Express checks handler.length === 4 to distinguish error handlers'],
        sampleStrongAnswer: 'Express inspects the arity of the middleware function using `fn.length`. If `fn.length === 4`, Express treats it as an error-handling middleware. If you omit the `next` argument and write `(err, req, res)`, `fn.length` is 3, and Express mistakenly treats it as standard middleware and skips it when errors occur.',
      },
    ],
  },
  {
    id: 'nodejs-rate-limiting-redis',
    title: 'Distributed Sliding Window Rate Limiter with Redis Race Conditions',
    type: 'coding',
    topic: 'Node.js',
    subtopic: 'Rate limiting',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A public developer API allows 100 requests per minute per API key. Under distributed load test across 8 API server instances, clients are able to send 250 requests per minute because of a Read-Modify-Write race condition in the Redis rate limiting logic.',
    problemStatement:
      'The current implementation fetches the count from Redis with `GET`, checks if `count < 100` in Node.js, and then issues `INCR`. Concurrently arriving requests all read `count = 99` before any of them increments, permitting burst overages. Implement an atomic sliding-window rate limiter using Redis Lua scripting or atomic multi-exec pipelines.',
    constraints: [
      'Must guarantee strict enforcement of 100 req/60s across distributed cluster.',
      'Must be fully atomic: zero window race conditions.',
      'Return remaining tokens and reset timestamp in standard headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.',
    ],
    starterCode: `/**
 * Non-Atomic Distributed Rate Limiter
 */
class RedisRateLimiter {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  async checkLimit(apiKey) {
    const key = \`rate:\${apiKey}\`;
    
    // BUG: Read-Modify-Write race condition!
    // Multiple concurrent requests read the same count simultaneously.
    const current = await this.redis.get(key);
    const count = current ? parseInt(current, 10) : 0;

    if (count >= 100) {
      return { allowed: false, remaining: 0 };
    }

    await this.redis.incr(key);
    if (count === 0) {
      await this.redis.expire(key, 60);
    }

    return { allowed: true, remaining: 100 - (count + 1) };
  }
}

function solution(input) {
  return "atomic_lua_sliding_window";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain the Read-Modify-Write race condition across distributed API servers.',
      'Implement an atomic rate limiter using Redis Lua script or sorted sets (`ZADD`, `ZREMRANGEBYSCORE`, `ZCARD`).',
      'Explain the difference between Fixed Window Counter, Sliding Log (Sorted Set), and Sliding Window Counter.',
    ],
    hints: [
      'Redis executes Lua scripts atomically: no other command can run while the script executes.',
      'Alternatively, for a fixed window, `INCR` followed by `EXPIRE` on first increment (or `SET key 1 NX EX 60`) provides atomicity.',
    ],
    testCases: [
      {
        id: 'tc-ratelimit-1',
        name: 'Atomically evaluates rate limit with zero race conditions',
        inputDescription: 'null',
        expectedOutput: '"atomic_lua_sliding_window"',
        explanation: 'Enforces strict quota under high concurrency.',
      },
    ],
    rubric: [
      {
        id: 'rb-rate-limit-atomicity',
        category: 'security',
        label: 'Concurrency Atomicity & Algorithm Selection',
        description: 'Implements atomic operations via Lua script or atomic Redis commands.',
        weight: 5,
        levels: [
          { score: 3, description: 'Implements atomic Lua script or Sliding Window Sorted Set with complete thread safety.' },
          { score: 2, description: 'Uses INCR first but misses sliding window boundary edge cases.' },
          { score: 0, description: 'Leaves Read-Modify-Write vulnerability.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `In distributed systems, doing 'GET', evaluating the number in application memory, and then calling 'INCR' is an anti-pattern. Between the 'GET' and the 'INCR', dozens of other API server instances can execute the same 'GET' and observe the same counter value.
      
Fix:
Use a Redis Lua script to execute the Sliding Window Counter atomically in Redis engine memory.
Using Redis Sorted Sets (ZSET):
1. Key = 'ratelimit:{apiKey}'
2. Score & Member = Current timestamp (ms)
3. Remove old timestamps older than (now - windowSize): 'ZREMRANGEBYSCORE key 0 (now - 60000)'
4. Count elements in current window: 'ZCARD key'
5. If count < limit: 'ZADD key now now', 'EXPIRE key 60', allow request.
6. Else: Reject request with 429 Too Many Requests.`,
      codeOrArtifact: `const SLIDING_WINDOW_LUA = \`
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])
  local clearBefore = now - window

  redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
  local currentRequests = redis.call('ZCARD', key)

  if currentRequests < limit then
    redis.call('ZADD', key, now, now)
    redis.call('EXPIRE', key, math.ceil(window / 1000))
    return {1, limit - currentRequests - 1}
  else
    return {0, 0}
  end
\`;

class AtomicSlidingWindowLimiter {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  async checkLimit(apiKey, limit = 100, windowMs = 60000) {
    const key = \`rate:\${apiKey}\`;
    const now = Date.now();
    const [allowed, remaining] = await this.redis.eval(
      SLIDING_WINDOW_LUA,
      1,
      key,
      now,
      windowMs,
      limit
    );

    return {
      allowed: Boolean(allowed),
      remaining,
    };
  }
}`,
    },
    alternativeApproaches: [
      'Generic Cell Rate Algorithm (GCRA) / Leaky Bucket using Redis `redis-cell` module.',
      'Cloudflare / AWS WAF edge rate limiting.',
    ],
    commonMistakes: [
      'Using Fixed Window which allows 2x limit bursts at window boundaries (e.g. 100 requests at 0:59 and 100 requests at 1:01).',
      'Forgetting to set TTL/EXPIRE on the Redis key, leaking memory indefinitely.',
    ],
    followUpQuestions: [
      {
        id: 'node-fq-3',
        question: 'What is the memory trade-off of the Sorted Set Sliding Window algorithm vs the Sliding Window Counter algorithm?',
        expectedConcepts: ['Sorted Set stores every request timestamp (high memory for high traffic)', 'Sliding Window Counter stores 2 counters and weights them (low memory, ~O(1))'],
        sampleStrongAnswer: 'The Sorted Set sliding log algorithm stores an entry for every single request in the time window, which consumes significant Redis RAM when handling millions of requests. The Sliding Window Counter algorithm (Cloudflare approach) approximates the count by storing only two integers (current minute and previous minute counters) and computing a weighted sum, reducing memory to O(1) with 99.5% accuracy.',
      },
    ],
  },
  {
    id: 'nodejs-stream-backpressure',
    title: 'Multi-Gigabyte Financial Audit CSV Export Out-of-Memory (OOM) Crash',
    type: 'debugging',
    topic: 'Node.js',
    subtopic: 'Validation',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A compliance portal provides a button for financial auditors to export yearly transaction records (typically 3,000,000 rows, ~1.8GB CSV). Whenever an auditor triggers the export, the Node.js container memory spikes past the 2GB limit and Kubernetes kills the container with `ExitCode 137 (OOMKilled)`.',
    problemStatement:
      'The export handler queries all 3 million rows from PostgreSQL with a single `db.query()` and pushes formatted CSV strings into an HTTP response stream using `res.write()` in a fast while loop without respecting stream backpressure or `readable.pause()`. The buffer memory fills up faster than the client can download, crashing the server.',
    constraints: [
      'Export must stream smoothly with flat, bounded memory consumption (under 80MB RSS).',
      'Must respect Stream backpressure (`res.write() === false` and `drain` event).',
      'Use Node.js `stream.pipeline` or database cursor stream.',
    ],
    starterCode: `const { Readable } = require('stream');

/**
 * Buggy Memory-Flooding Exporter
 */
async function exportAuditCsv(req, res, db) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="audit.csv"');

  // BUG 1: Loads entire multi-gigabyte dataset into V8 heap at once
  const rows = await db.query('SELECT * FROM transactions');

  // BUG 2: Ignores backpressure! res.write() returns false when TCP send buffer is full,
  // but this loop continues shoving data into the unbounded internal buffer until OOM crash.
  for (const row of rows) {
    const csvLine = \`\${row.id},\${row.amount},\${row.timestamp}\\n\`;
    res.write(csvLine);
  }

  res.end();
}

function solution(input) {
  return "stream_pipeline_backpressure_handled";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain how `res.write()` backpressure works and what the return value `false` indicates.',
      'Refactor to use PostgreSQL Cursor stream (`pg-query-stream`) piped through a Transform stream.',
      'Use `stream.pipeline()` to handle errors and clean up socket listeners on premature client disconnect.',
    ],
    hints: [
      'When `res.write()` returns `false`, stop writing and wait for the `drain` event on `res`.',
      'Even better: `stream.pipeline(dbStream, transformCsvStream, res, (err) => ...)` handles backpressure and abort cleanup automatically.',
    ],
    testCases: [
      {
        id: 'tc-stream-oom-1',
        name: 'Streams gigabyte dataset with constant bounded memory',
        inputDescription: 'null',
        expectedOutput: '"stream_pipeline_backpressure_handled"',
        explanation: 'Enforces backpressure and cursor-based chunking.',
      },
    ],
    rubric: [
      {
        id: 'rb-stream-backpressure',
        category: 'reliability',
        label: 'Node.js Streams & Backpressure Management',
        description: 'Demonstrates deep mastery of stream backpressure, highWaterMark, and pipeline.',
        weight: 5,
        levels: [
          { score: 3, description: 'Uses database cursor streaming and pipeline with automatic backpressure and disconnect cleanup.' },
          { score: 2, description: 'Fixes database cursor but manually listens to drain without handling errors.' },
          { score: 0, description: 'Buffers rows in memory.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Two critical flaws caused the OOM crash:
1. Buffering entire dataset in memory: 'db.query()' fetches all 3,000,000 rows into an array in V8 heap, exceeding the default 1.4GB heap limit.
2. Lack of backpressure: 'res.write()' is an asynchronous write to a TCP socket. If the client downloads at 1MB/s while the loop writes at 50MB/s, the operating system kernel socket buffer fills up. When full, 'res.write()' returns 'false', and Node buffers the unwritten data in heap RAM. Continuing to write causes unbounded memory expansion until the process is OOMKilled.
      
Fix:
Use 'pg-query-stream' to fetch rows from PostgreSQL via a cursor in batches of 500, pass through a Transform stream to format CSV lines, and connect to 'res' using 'stream.pipeline()'. 'pipeline' automatically handles backpressure (pausing the readable stream when writable buffer reaches highWaterMark) and destroys the database cursor if the client closes the connection.`,
      codeOrArtifact: `const { pipeline, Transform } = require('stream');
const QueryStream = require('pg-query-stream');

async function exportAuditCsvStream(req, res, dbClient) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="audit.csv"');

  // 1. Fetch via database cursor with batch size 500
  const query = new QueryStream('SELECT id, amount, timestamp FROM transactions', [], {
    batchSize: 500,
  });
  const stream = dbClient.query(query);

  // 2. Transform database row objects into CSV strings
  const csvTransform = new Transform({
    objectMode: true,
    transform(row, encoding, callback) {
      const line = \`\${row.id},\${row.amount},\${row.timestamp}\\n\`;
      callback(null, line);
    },
  });

  // 3. pipeline handles backpressure, drain events, and cleans up streams on client abort
  pipeline(stream, csvTransform, res, (err) => {
    if (err) {
      console.error('Pipeline error or client aborted download', err);
    }
  });
}`,
    },
    alternativeApproaches: [
      'Generating the file asynchronously via background worker, uploading to S3, and providing a pre-signed download URL.',
    ],
    commonMistakes: [
      'Using `stream.pipe()` instead of `stream.pipeline()`: `.pipe()` does not properly forward errors or destroy source streams when the client disconnects.',
      'Increasing Node heap memory `--max-old-space-size=8192` as a band-aid instead of fixing the streaming architecture.',
    ],
    followUpQuestions: [
      {
        id: 'node-fq-4',
        question: 'Why is `stream.pipeline` preferred over `source.pipe(destination)` in modern Node.js?',
        expectedConcepts: ['Error forwarding', 'Proper stream destruction on close/abort', 'Prevents file descriptor leaks'],
        sampleStrongAnswer: '`source.pipe(dest)` does not forward errors between streams; if `dest` errors, `source` is not closed automatically, leading to dangling database connections and memory leaks. In contrast, `stream.pipeline` properly forwards errors, cleans up all streams in the pipeline if any of them fails, and handles premature close events cleanly.',
      },
    ],
  },
  {
    id: 'nodejs-graceful-shutdown-worker',
    title: 'Kubernetes Rolling Deployment Background Transaction Data Loss',
    type: 'debugging',
    topic: 'Node.js',
    subtopic: 'Graceful shutdown',
    difficulty: 'Senior',
    estimatedMinutes: 25,
    businessContext:
      'During automated CI/CD deployments of a payout processing worker service on Kubernetes, payouts occasionally get left in a half-processed `PENDING` state with missing bank transfers, requiring manual database surgery to reconcile balances.',
    problemStatement:
      'When Kubernetes deploys a new replica set, it sends a `SIGTERM` signal to the old pods. The Node.js application immediately executed `process.exit(0)` inside the `SIGTERM` handler. Any background database transaction currently running mid-flight was aborted abruptly without rolling back or finishing, corrupting ledger balances.',
    constraints: [
      'Must intercept `SIGTERM` and `SIGINT` signals.',
      'Stop accepting new jobs from Redis / BullMQ / SQS queue.',
      'Allow active in-flight transactions a graceful grace period (e.g. 15s) to complete.',
      'Close database connection pools cleanly before exiting.',
    ],
    starterCode: `const http = require('http');

/**
 * Buggy Abrupt Shutdown Handler
 */
function setupProcessLifecycle(server, dbPool, jobQueue) {
  // BUG: Instantly kills process, killing in-flight bank payouts!
  process.on('SIGTERM', () => {
    console.log("SIGTERM received. Terminating immediately.");
    process.exit(0);
  });
}

function solution(input) {
  return "graceful_shutdown_coordinated";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain the Kubernetes pod termination lifecycle (`preStop`, `SIGTERM`, `terminationGracePeriodSeconds`, `SIGKILL`).',
      'Implement coordinated graceful shutdown: stop accepting new work -> wait for in-flight tasks -> close DB pools -> `process.exit(0)`.',
      'Add a hard timeout fallback so the process exits even if a stuck connection hangs.',
    ],
    hints: [
      'On SIGTERM: 1) Stop listening to new HTTP requests / pause queue worker. 2) Wait for active operations. 3) Close database pool. 4) Set safety timeout (e.g. 15s) to force-exit if stuck.',
      'Remember to call forceExitTimer.unref() so the safety timer does not keep the event loop alive on its own after all connections finish.',
    ],
    testCases: [
      {
        id: 'tc-shutdown-1',
        name: 'Coordinates graceful shutdown and finishes active jobs',
        inputDescription: 'null',
        expectedOutput: '"graceful_shutdown_coordinated"',
        explanation: 'Safely protects in-flight transactions during rolling restart.',
      },
    ],
    rubric: [
      {
        id: 'rb-graceful-shutdown',
        category: 'reliability',
        label: 'Production Lifecycle & Graceful Teardown',
        description: 'Implements orderly teardown of servers, queues, and database connections.',
        weight: 5,
        levels: [
          { score: 3, description: 'Stops ingestion, drains pending work, closes DB pool, and sets hard fallback timer.' },
          { score: 2, description: 'Closes server but forgets DB pool cleanup or force-kill timeout.' },
          { score: 0, description: 'Calls process.exit immediately.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `When Kubernetes terminates a pod (during rolling updates, auto-scaling, or node drain):
1. Pod is set to Terminating state and removed from Service endpoints.
2. Kubernetes sends SIGTERM signal to PID 1 inside the container.
3. Kubernetes waits for 'terminationGracePeriodSeconds' (default 30s).
4. If the process is still running after the grace period, Kubernetes sends SIGKILL (kill -9).
      
If the Node.js application calls 'process.exit(0)' immediately upon SIGTERM, in-flight HTTP requests and background database transactions are severed instantly.
      
Fix:
Coordinate an orderly shutdown sequence:
1. Stop accepting new HTTP requests ('server.close()') and pause queue consumer.
2. Track active in-flight transactions and await their completion.
3. Drain and close database connection pool ('pool.end()').
4. Include a safety timeout (e.g. 15s) so if a task is deadlocked, the process exits cleanly before SIGKILL.`,
      codeOrArtifact: `function setupGracefulShutdown(server, dbPool, jobQueue) {
  let isShuttingDown = false;

  async function shutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(\`Received \${signal}. Starting graceful shutdown...\`);

    // Safety timeout: force exit if tasks hang
    const forceExitTimer = setTimeout(() => {
      console.error('Graceful shutdown timed out after 20s. Forcing exit.');
      process.exit(1);
    }, 20000);
    forceExitTimer.unref();

    try {
      // 1. Pause queue: Stop taking new jobs
      if (jobQueue) {
        await jobQueue.pause(true); // wait for active jobs to finish
      }

      // 2. Stop accepting new HTTP connections
      await new Promise((resolve) => server.close(resolve));

      // 3. Close database connection pool
      await dbPool.end();

      console.log('All connections closed cleanly. Exiting.');
      process.exit(0);
    } catch (err) {
      console.error('Error during graceful shutdown:', err);
      process.exit(1);
    }
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}`,
    },
    alternativeApproaches: [
      'Using Kubernetes `preStop` hook with `sleep 5` before SIGTERM to allow load balancer iptables propagation.',
    ],
    commonMistakes: [
      'Not calling `forceExitTimer.unref()`, which can keep the event loop alive by itself.',
      'Closing the database pool before waiting for active HTTP requests to complete, causing in-flight requests to fail with "Connection pool closed".',
    ],
    followUpQuestions: [
      {
        id: 'node-fq-5',
        question: 'Why do Kubernetes engineers recommend adding a `preStop` sleep 5 hook before SIGTERM in Node.js pods?',
        expectedConcepts: ['IPTables / kube-proxy propagation latency', 'Preventing traffic routing to a pod after SIGTERM has already begun closing listeners'],
        sampleStrongAnswer: 'When a pod enters Terminating state, kube-proxy and Ingress controllers take a few seconds to update iptables and remove the pod IP from load balancer endpoints. If the pod closes its listening socket immediately upon SIGTERM, requests still in-flight from the load balancer receive `ECONNREFUSED`. A `preStop` sleep 5 ensures no new requests are being routed to the pod before it begins closing sockets.',
      },
    ],
  },
];
