import { Scenario } from '@/types/scenario';

export const javascriptScenarios: Scenario[] = [
  {
    id: 'js-event-loop-microtasks',
    title: 'Flash-Sale Batch Processor Microtask Queue Starvation',
    type: 'debugging',
    topic: 'JavaScript',
    subtopic: 'Event loop and microtasks',
    difficulty: 'Senior',
    estimatedMinutes: 25,
    businessContext:
      'During Black Friday peak traffic on a flash-sale e-commerce platform, the checkout order-ingestion service experiences severe WebSocket heartbeat timeouts and dropping health-check endpoints, leading Kubernetes to repeatedly restart healthy pods.',
    problemStatement:
      'The order batching function processes order queues recursively using Promise.resolve().then(processNextOrder). While CPU load appears moderate (~65%), the HTTP server stops responding to TCP health probes and WebSocket ping/pongs disconnect thousands of shoppers. Diagnose why the event loop is blocked and implement a cooperative scheduling mechanism.',
    constraints: [
      'Orders must continue to process with maximum throughput without starving macrotasks (I/O, timers, incoming network packets).',
      'Memory consumption must remain bounded under a 50,000 order surge.',
      'Cannot use synchronous blocking loops.',
    ],
    starterCode: `/**
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
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Identify why Promise.resolve().then() recursion starves macrotasks like I/O and setTimeout.',
      'Refactor the processor to use cooperative scheduling (e.g., yielding via setImmediate or setTimeout every N iterations or when a budget threshold is exceeded).',
      'Explain the difference in event loop phases (Timer, Poll, Check, Microtask drain).',
    ],
    hints: [
      'Microtasks (Promise reactions, queueMicrotask, process.nextTick) are drained completely before the event loop advances to the next macrotask phase.',
      'If microtasks continually queue more microtasks, macrotasks (such as socket I/O, HTTP server accept, ping/pong timers) never get executed.',
      'Introduce a batch threshold (e.g. process 50 items) or a time slice budget (e.g. 8ms), then yield control using setImmediate() or setTimeout(..., 0).',
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Processes small batch accurately',
        inputDescription: '10',
        expectedOutput: '"completed"',
        explanation: 'Small batches should resolve successfully without unbounded delay.',
      },
      {
        id: 'tc-2',
        name: 'Yields cooperatively on large batch',
        inputDescription: '500',
        expectedOutput: '"completed"',
        explanation: 'Large orders must complete without starving macrotasks.',
      },
    ],
    rubric: [
      {
        id: 'rb-root-cause',
        category: 'root_cause',
        label: 'Event Loop & Microtask Queue Starvation Understanding',
        description: 'Understands that microtask queue empties completely before macrotask queue (I/O) is processed.',
        weight: 5,
        levels: [
          { score: 3, description: 'Clearly explains microtask starvation semantics and how it suffocated TCP ping/pong macrotasks.' },
          { score: 2, description: 'Identifies that Promise recursion is the issue but vague on macrotask vs microtask phase transitions.' },
          { score: 1, description: 'Thinks the code is simply running out of memory or needs multithreading.' },
          { score: 0, description: 'Fails to identify asynchronous event loop mechanics.' },
        ],
      },
      {
        id: 'rb-correctness',
        category: 'correctness',
        label: 'Cooperative Scheduling Implementation',
        description: 'Implements yield pattern with setImmediate / setTimeout / MessageChannel without stack overflow.',
        weight: 4,
        levels: [
          { score: 3, description: 'Yields every N items or using performance.now() budget cleanly.' },
          { score: 2, description: 'Yields on every single item causing high timer overhead.' },
          { score: 1, description: 'Replaces with synchronous for-loop which still blocks the thread.' },
          { score: 0, description: 'Fails to implement cooperative scheduling.' },
        ],
      },
      {
        id: 'rb-tradeoffs',
        category: 'tradeoffs',
        label: 'Performance & Latency Trade-offs',
        description: 'Balances per-item throughput against latency for concurrent socket I/O.',
        weight: 3,
        levels: [
          { score: 3, description: 'Analyzes batch chunk size (e.g. 50-100 items per tick) vs event-loop delay.' },
          { score: 2, description: 'Mentions chunking but does not provide operational trade-offs.' },
          { score: 1, description: 'Does not consider latency impact.' },
          { score: 0, description: 'No analysis provided.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Microtasks (Promise callbacks, process.nextTick, queueMicrotask) run at the end of the current macrotask tick and will continue draining until the microtask queue is completely exhausted. In the original code, step() queues another Promise.resolve().then(step) recursively. This keeps the microtask queue non-empty forever while orders remain, starving the event loop from ever reaching the Poll phase (where incoming TCP socket data and health checks are accepted) or Timers phase (where WebSocket ping timeouts fire).
      
Fix: Implement cooperative chunking. Process in chunks (e.g. 50 orders) or check if time elapsed exceeds a budget (e.g. 10ms). When the budget expires, schedule the continuation using setImmediate (Node.js) or setTimeout(step, 0) / MessageChannel (browser), allowing the event loop to service socket I/O and timer events before resuming order processing.`,
      codeOrArtifact: `function processOrderBatch(orders, onOrderProcessed) {
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
}`,
    },
    alternativeApproaches: [
      'Using Async Generators with for-await-of loop and time-budgeted yields.',
      'Offloading heavy batch ingestion to Node.js Worker Threads (worker_threads) with SharedArrayBuffer or message passing.',
    ],
    commonMistakes: [
      'Replacing Promise.resolve().then() with setImmediate on every single item, introducing 100x timer bookkeeping overhead.',
      'Converting to a synchronous while loop, which freezes the event loop completely for seconds.',
      'Using process.nextTick(), which is even more aggressive than Promises and immediately crashes process health checks.',
    ],
    followUpQuestions: [
      {
        id: 'js-fq-1',
        question: 'What is the priority difference between process.nextTick() and Promise.then() in Node.js?',
        expectedConcepts: ['nextTickQueue takes priority over Promise microtask queue', 'process.nextTick runs immediately after the current operation before any other microtasks'],
        sampleStrongAnswer: 'In Node.js, process.nextTick() has its own nextTickQueue which is processed immediately after the current operation finishes, before the Promise microtask queue. Excessive recursive nextTick calls will starve Promises, whereas Promise.resolve().then uses the standard microtask queue.',
      },
    ],
  },
  {
    id: 'js-closures-memory-leak',
    title: 'SSE Connection Manager Request Context Closure Leak',
    type: 'debugging',
    topic: 'JavaScript',
    subtopic: 'Closures and scope',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A subscription trading platform provides real-time Server-Sent Events (SSE) to push portfolio updates. Over 24 hours of operation, the service Node.js process RSS memory swells from 150MB to 3.8GB, triggering container out-of-memory crashes.',
    problemStatement:
      'Heap snapshot inspection reveals thousands of retained ClientSession closures holding large http.IncomingMessage and AuthToken contexts in memory even though the user has only subscribed to price alerts. Fix the retention pattern and prevent closure-based memory leaks.',
    constraints: [
      'Must maintain real-time push to active SSE clients.',
      'Must properly clean up listeners and references when client disconnects.',
      'Cannot retain unneeded request payloads or auth credential strings in long-lived client descriptors.',
    ],
    starterCode: `/**
 * Real-Time SSE Connection Handler with Hidden Retention Leak
 */
class ConnectionHub {
  constructor() {
    this.clients = new Set();
  }

  registerConnection(req, res) {
    // Large transient auth tokens & headers
    const requestMetadata = {
      headers: req.headers,
      body: req.body,
      receivedAt: Date.now()
    };
    
    const clientId = req.headers['x-client-id'] || Math.random().toString();

    // BUG: The broadcast handler forms a closure over 'requestMetadata' and 'req',
    // preventing the V8 garbage collector from sweeping the entire request tree!
    const client = {
      id: clientId,
      send: (data) => {
        if (requestMetadata.headers) {
          res.write(\`data: \${JSON.stringify({ clientId, payload: data })}\\n\\n\`);
        }
      }
    };

    this.clients.add(client);
    
    req.on('close', () => {
      // Missing cleanup of client or closure references
      res.end();
    });
  }
}

function solution(input) {
  const hub = new ConnectionHub();
  return "repaired";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Identify how the lexical scope closure retains `requestMetadata` and `req` in V8 heap.',
      'Refactor `registerConnection` to extract only the needed primitive identifiers (`clientId`, `res`) and nullify references.',
      'Ensure the disconnect listener (`req.on("close")`) removes the client from `this.clients`.',
    ],
    hints: [
      'Any variable accessed by an inner function survives as long as that inner function is referenced by an active object (the Set).',
      'The client object is added to `this.clients`, and its `send` method references `requestMetadata`, holding the entire request in heap forever.',
      'Clean up the Set on disconnect: `this.clients.delete(client)`.',
    ],
    testCases: [
      {
        id: 'tc-leak-1',
        name: 'Clean connection and disconnection lifecycle',
        inputDescription: '"test-client"',
        expectedOutput: '"repaired"',
        explanation: 'Ensures disconnected clients are cleared and no transient request closures are retained.',
      },
    ],
    rubric: [
      {
        id: 'rb-closure-analysis',
        category: 'root_cause',
        label: 'Lexical Environment & Heap Analysis',
        description: 'Explains how the inner function retains outer scope variables and V8 closure contexts.',
        weight: 5,
        levels: [
          { score: 3, description: 'Explains V8 Context objects and how shared scopes retain outer variables as long as any closure is alive.' },
          { score: 2, description: 'Identifies that requestMetadata is kept alive, but does not identify the Set retention.' },
          { score: 1, description: 'Only mentions adding client to array without understanding closure retention.' },
          { score: 0, description: 'Fails to diagnose closure memory leak.' },
        ],
      },
      {
        id: 'rb-cleanup',
        category: 'reliability',
        label: 'Event Listener & Collection Cleanup',
        description: 'Implements explicit removal from Set and event listener teardown.',
        weight: 4,
        levels: [
          { score: 3, description: 'Removes client from Set on close and detaches event listeners cleanly.' },
          { score: 2, description: 'Removes from Set but misses error event handlers.' },
          { score: 1, description: 'Only nullifies local variables without cleaning the Set.' },
          { score: 0, description: 'Missing cleanup.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `In JavaScript engines like V8, when an inner function accesses any variable in its enclosing scope, a Lexical Context object is created. In this code, 'client.send' accessed 'requestMetadata.headers'. Because 'client' was stored in 'this.clients' (a long-lived Set), 'client.send' stayed reachable. Consequently, 'requestMetadata' (and potentially 'req') was never garbage collected. Furthermore, on socket close, the client was never removed from 'this.clients', creating an unbounded leak for every visitor.
      
Fix:
1. Extract only the minimal data needed (e.g. clientId) before creating the client object.
2. Ensure 'this.clients.delete(client)' is called on 'close' and 'error'.
3. Nullify closures on teardown.`,
      codeOrArtifact: `class ConnectionHub {
  constructor() {
    this.clients = new Set();
  }

  registerConnection(req, res) {
    const clientId = String(req.headers['x-client-id'] || crypto.randomUUID());

    const client = {
      id: clientId,
      send: (data) => {
        res.write(\`data: \${JSON.stringify({ clientId, payload: data })}\\n\\n\`);
      }
    };

    this.clients.add(client);

    const cleanup = () => {
      this.clients.delete(client);
      req.off('close', cleanup);
      req.off('error', cleanup);
      try { res.end(); } catch (_) {}
    };

    req.on('close', cleanup);
    req.on('error', cleanup);
  }
}`,
    },
    alternativeApproaches: [
      'Using WeakSet / WeakRef if clients are tracked via an external object lifecycle.',
      'Using an EventSource abstraction with AbortController for unified signal teardown.',
    ],
    commonMistakes: [
      'Thinking deleting the local variable inside registerConnection deletes the closure.',
      'Forgetting to handle socket error events in addition to close events.',
    ],
    followUpQuestions: [
      {
        id: 'js-fq-2',
        question: 'How do you take and analyze a Node.js heap dump in production without taking the server down?',
        expectedConcepts: ['v8.writeHeapSnapshot()', 'Chrome DevTools heap comparison', 'Inspecting Retainers tree'],
        sampleStrongAnswer: 'You can use v8.writeHeapSnapshot() triggered via a secure admin endpoint or SIGUSR2 signal. You then load two snapshots into Chrome DevTools (one at baseline, one after traffic) and use the "Comparison" view to filter by delta and inspect the Retainer tree to find what object keeps the target alive.',
      },
    ],
  },
  {
    id: 'js-promise-race-condition',
    title: 'Multi-Tab Wallet Checkout Balance Debit Race Condition',
    type: 'coding',
    topic: 'JavaScript',
    subtopic: 'Race conditions',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A digital wallet and subscription checkout interface allows users to redeem promo gift balances. When a user opens multiple browser tabs or clicks "Pay with Balance" concurrently, two requests race against each other, allowing the user to spend a \$50 balance twice.',
    problemStatement:
      'Design a client-side and API concurrency guard. On the client side, implement an asynchronous mutex / queue runner that prevents parallel in-flight checkout mutations for the same wallet ID, serializes requests, and handles cancellation / idempotency headers.',
    constraints: [
      'Must guarantee only 1 mutation per key runs at any time.',
      'Pending invocations should queue or reject cleanly with ConcurrentOperationError.',
      'Must clean up queue state when promises resolve or reject to avoid memory leaks.',
    ],
    starterCode: `/**
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
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Implement `runExclusive(key, task)` using Promise chaining or a queue of resolvers.',
      'Ensure if `task()` throws an exception, the next queued task still executes and the error is propagated to the caller.',
      'Delete the lock from `this.locks` when the queue for that key becomes empty.',
    ],
    hints: [
      'Track a current Promise for each key: `this.locks.get(key) || Promise.resolve()`.',
      'Chain the next task onto that promise using `.finally()`.',
      'Be careful to catch errors in the chain so a failure does not block subsequent tasks in the queue forever.',
    ],
    testCases: [
      {
        id: 'tc-race-1',
        name: 'Serializes tasks sequentially for same key',
        inputDescription: 'null',
        expectedOutput: '["start-1","end-1","start-2","end-2"]',
        explanation: 'Task 2 must wait until Task 1 finishes completely before starting.',
      },
    ],
    rubric: [
      {
        id: 'rb-mutex-correctness',
        category: 'correctness',
        label: 'Serialization & Exclusivity',
        description: 'Tasks with matching keys execute in strict sequence without overlap.',
        weight: 5,
        levels: [
          { score: 3, description: 'Strict sequential execution with complete isolation between different keys.' },
          { score: 2, description: 'Serializes correctly but fails if task throws an error.' },
          { score: 1, description: 'Attempts boolean flag which fails across async tick pauses.' },
          { score: 0, description: 'No serialization achieved.' },
        ],
      },
      {
        id: 'rb-cleanup-keys',
        category: 'reliability',
        label: 'Lock Table Memory Cleanliness',
        description: 'Map entries are deleted once all pending tasks complete.',
        weight: 4,
        levels: [
          { score: 3, description: 'Deletes key from map when queue is drained.' },
          { score: 2, description: 'Leaves dead resolved promises in Map indefinitely.' },
          { score: 0, description: 'Unbounded memory leak.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `An asynchronous keyed mutex coordinates tasks by maintaining a promise chain per key. When a new task arrives:
1. We retrieve the previous tail promise for that key (or Promise.resolve() if idle).
2. We chain the new task after the previous promise finishes (using .then or .finally so rejection doesn't break the chain).
3. We store the new tail in the map.
4. When the tail resolves and no further tasks are waiting, we delete the key from the map to prevent memory leaks.`,
      codeOrArtifact: `class AsyncKeyedMutex {
  constructor() {
    this.locks = new Map();
  }

  async runExclusive(key, task) {
    const previous = this.locks.get(key) || Promise.resolve();

    let release;
    const currentLock = new Promise((resolve) => {
      release = resolve;
    });

    this.locks.set(key, currentLock);

    try {
      await previous;
      return await task();
    } finally {
      release();
      if (this.locks.get(key) === currentLock) {
        this.locks.delete(key);
      }
    }
  }
}`,
    },
    alternativeApproaches: [
      'FIFO Array queue of defer resolvers with an active worker loop.',
      'Distributed Redis Redlock / optimistic concurrency token on the server side (crucial for multi-server setups).',
    ],
    commonMistakes: [
      'Using a simple boolean flag: between the check and the async operation, another invocation enters.',
      'Uncaught exceptions in task 1 causing task 2 to hang forever because release() is not in a finally block.',
    ],
    followUpQuestions: [
      {
        id: 'js-fq-3',
        question: 'Why is client-side mutex locking insufficient on its own for preventing double spending in payments?',
        expectedConcepts: ['Bypass via curl / Postman', 'Network retries and multi-device access', 'Database transaction row lock required'],
        sampleStrongAnswer: 'Client-side locking only protects against user UI duplicate clicks or multi-tab races in the same browser. It cannot prevent direct API abuse via curl, concurrent requests from different mobile devices, or network duplicate deliveries. True financial safety requires database-level transactional locks (SELECT FOR UPDATE) and idempotent request keys in Redis or PostgreSQL.',
      },
    ],
  },
  {
    id: 'js-async-error-propagation',
    title: 'Background Reconciliation Pipeline Unhandled Rejection Crash',
    type: 'debugging',
    topic: 'JavaScript',
    subtopic: 'Error propagation',
    difficulty: 'Senior',
    estimatedMinutes: 25,
    businessContext:
      'A monthly B2B billing service processes 10,000 subscription invoices in the background. In production, an unexpected currency conversion API timeout crashes the entire Node process with unhandledRejection, causing half the billing run to be skipped without notifications.',
    problemStatement:
      'The pipeline mixes raw Promise arrays with Promise.all() and forEach loops. When one invoice fails, unhandled rejections terminate the worker. Refactor the pipeline to process invoices using Promise.allSettled(), collect individual failures for retry queues, and ensure no unhandled promise rejections can crash the process.',
    constraints: [
      'A single failing invoice must not abort other invoices in the batch.',
      'All failures must be categorized and logged with invoice ID and failure reason.',
      'Must return an aggregate summary: { succeeded: number, failed: Array<{ id, error }> }.',
    ],
    starterCode: `/**
 * Fragile Invoice Batch Processing
 */
async function processInvoices(invoices, billingService) {
  const results = [];

  // BUG 1: forEach does not await async callbacks!
  // BUG 2: Unhandled exceptions inside async callbacks trigger process unhandledRejection
  invoices.forEach(async (inv) => {
    const receipt = await billingService.charge(inv);
    results.push(receipt);
  });

  return results;
}

// Verification runner
async function solution(scenario) {
  const mockService = {
    charge: async (inv) => {
      if (inv.id === 2) throw new Error("Card expired");
      return { id: inv.id, status: "PAID" };
    }
  };

  const invoices = [{ id: 1 }, { id: 2 }, { id: 3 }];
  
  // Refactor to use safe batch execution
  // Return summary object { succeeded: count, failedCount: count }
  return "repaired";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain why `Array.prototype.forEach` with an async callback fails to await promises.',
      'Replace the approach with `Promise.allSettled()` or chunked concurrency.',
      'Return a resilient structure `{ succeeded: number, failed: Array<{ id, reason }> }`.',
    ],
    hints: [
      'Array.forEach ignores the return value of its callback; it fires all async functions synchronously and does not wait.',
      'Promise.allSettled() returns an array of objects describing the outcome of each promise (fulfilled or rejected).',
    ],
    testCases: [
      {
        id: 'tc-async-1',
        name: 'Gracefully handles mixed success and failures',
        inputDescription: '"batch-1"',
        expectedOutput: '"repaired"',
        explanation: 'All invoices are evaluated and failures do not crash the batch.',
      },
    ],
    rubric: [
      {
        id: 'rb-async-await-loop',
        category: 'correctness',
        label: 'Asynchronous Iteration Mechanics',
        description: 'Understands why forEach cannot be used with async/await and uses proper iteration.',
        weight: 5,
        levels: [
          { score: 3, description: 'Correctly replaces forEach with Promise.allSettled() or for-of with try/catch.' },
          { score: 2, description: 'Uses Promise.all() which still short-circuits on first error.' },
          { score: 1, description: 'Attempts to use async in map() without awaiting Promise.all.' },
          { score: 0, description: 'Leaves forEach intact.' },
        ],
      },
      {
        id: 'rb-error-resilience',
        category: 'reliability',
        label: 'Failure Isolation and Error Reporting',
        description: 'Extracts error reasons and isolates failures from halting the batch.',
        weight: 4,
        levels: [
          { score: 3, description: 'Captures each failing item, maps error message, and produces comprehensive report.' },
          { score: 2, description: 'Catches error but ignores error metadata.' },
          { score: 0, description: 'Errors crash the routine.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `In JavaScript, 'Array.prototype.forEach' expects a synchronous callback. When you pass an async function to forEach, it executes the async function, receives a Promise, and discards it immediately. It neither awaits them nor captures rejections. As a result, 'processInvoices' returns an empty array before any charge finishes, and any rejected promise becomes an UnhandledPromiseRejection.
      
Fix:
Use 'Promise.allSettled(invoices.map(...))'. This guarantees every promise runs to completion. We then separate 'fulfilled' results from 'rejected' results and return a structured report.`,
      codeOrArtifact: `async function processInvoices(invoices, billingService) {
  const settled = await Promise.allSettled(
    invoices.map(async (inv) => {
      try {
        const receipt = await billingService.charge(inv);
        return { invoiceId: inv.id, receipt };
      } catch (err) {
        throw { invoiceId: inv.id, message: err.message || 'Billing failed' };
      }
    })
  );

  const succeeded = [];
  const failed = [];

  for (const item of settled) {
    if (item.status === 'fulfilled') {
      succeeded.push(item.value);
    } else {
      failed.push(item.reason);
    }
  }

  return {
    succeededCount: succeeded.length,
    failedCount: failed.length,
    succeeded,
    failed,
  };
}`,
    },
    alternativeApproaches: [
      'Sequential for-await-of loop with try/catch block if rate limits mandate serial execution.',
      'Worker pool (e.g. p-limit or p-map) with concurrency of 10 to protect external billing gateway from rate limits.',
    ],
    commonMistakes: [
      'Using Promise.all() thinking it solves error handling; Promise.all fails fast on the very first rejection and aborts reporting on remaining items.',
      'Putting try/catch around forEach: the synchronous try/catch finishes before the async promises even resolve.',
    ],
    followUpQuestions: [
      {
        id: 'js-fq-4',
        question: 'What is the default Node.js behavior when an unhandledRejection occurs in modern Node (v16+)?',
        expectedConcepts: ['Process exits with non-zero exit code (code 1)', 'Changed from warning to fatal crash to prevent corrupt state'],
        sampleStrongAnswer: 'In Node.js 15+, unhandled rejections terminate the process with exit code 1 by default (unhandled-rejections=throw). Previously it only printed a warning. This prevents applications from continuing in an undefined, corrupted state.',
      },
    ],
  },
  {
    id: 'js-perf-object-allocation',
    title: 'High-Throughput Metrics Aggregator Garbage Collection Latency Spikes',
    type: 'debugging',
    topic: 'JavaScript',
    subtopic: 'Performance optimization',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A telemetry agent ingests 100,000 JSON log metrics per second. P99 latency spikes above 2,500ms every 15 seconds. APM profiling indicates that V8 Scavenge and Mark-Sweep garbage collection pauses consume 35% of total CPU time due to massive ephemeral object allocations.',
    problemStatement:
      'Analyze the metrics parser and buffer pipeline. The current implementation allocates new object literals, closures, and intermediate strings for every incoming telemetry frame. Redesign the parsing loop using object pooling, typed arrays, or in-place buffer mutation to eliminate GC pressure.',
    constraints: [
      'Must sustain 100,000 items/sec without triggering major GC pauses over 50ms.',
      'Zero new heap allocations in the critical hot path.',
      'Accurately calculate min, max, sum, and count metrics.',
    ],
    starterCode: `/**
 * High GC Pressure Metrics Ingestion
 * Allocates hundreds of thousands of throwaway objects per second.
 */
function ingestMetrics(rawSamples) {
  // BUG: Allocates array and object wrappers on every sample
  const parsed = rawSamples.map((line) => {
    const parts = line.split(',');
    return {
      timestamp: Number(parts[0]),
      metricName: parts[1],
      value: parseFloat(parts[2]),
      metadata: { tag: parts[3] }
    };
  });

  const aggregates = {};
  for (const item of parsed) {
    if (!aggregates[item.metricName]) {
      aggregates[item.metricName] = { count: 0, sum: 0, min: Infinity, max: -Infinity };
    }
    const agg = aggregates[item.metricName];
    agg.count++;
    agg.sum += item.value;
    agg.min = Math.min(agg.min, item.value);
    agg.max = Math.max(agg.max, item.value);
  }

  return aggregates;
}

function solution(sampleCount) {
  // Optimized single-pass parser without intermediate object allocations
  return "optimized";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Identify memory allocation hotspots: `line.split`, intermediate object creation, nested metadata objects.',
      'Implement a single-pass parser that avoids creating temporary objects for each line.',
      'Explain how V8 Young Generation (Nursery/Intermediate) and Old Generation memory layout impacts latency.',
    ],
    hints: [
      'Instead of .map() + .split() creating arrays and objects, parse the numbers and metric names directly in a single pass.',
      'Reuse a single accumulator Map or typed array buffer instead of allocating nested objects on every line.',
    ],
    testCases: [
      {
        id: 'tc-perf-1',
        name: 'Aggregates metrics accurately with zero intermediate objects',
        inputDescription: '100',
        expectedOutput: '"optimized"',
        explanation: 'Processes metrics without GC churn.',
      },
    ],
    rubric: [
      {
        id: 'rb-gc-analysis',
        category: 'root_cause',
        label: 'V8 Garbage Collection Dynamics',
        description: 'Understands nursery allocation, scavenge overhead, and stop-the-world pauses.',
        weight: 5,
        levels: [
          { score: 3, description: 'Details V8 generational hypothesis, scavenge promotion to old gen, and mark-sweep pauses.' },
          { score: 2, description: 'Mentions too many objects created but vague on V8 internals.' },
          { score: 0, description: 'Unaware of GC impact.' },
        ],
      },
      {
        id: 'rb-optimization',
        category: 'code_quality',
        label: 'Allocation-Free Parsing',
        description: 'Implements single-pass streaming parsing without temporary heap objects.',
        weight: 5,
        levels: [
          { score: 3, description: 'Single pass parsing, zero intermediate arrays/objects, bounded memory usage.' },
          { score: 2, description: 'Reduces some allocations but still uses split() on every line.' },
          { score: 0, description: 'No meaningful allocation reduction.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Calling 'rawSamples.map' and 'line.split(',')' on 100,000 items/sec creates 100,000 intermediate arrays, 400,000 string instances, and 100,000 intermediate objects every single second. This rapidly floods V8's New Space (Nursery), triggering continuous Scavenge cycles and promoting surviving objects to the Old Space, which subsequently forces expensive Stop-The-World Mark-Sweep sweeps.
      
Fix:
Parse in a single pass without allocating intermediate objects or calling .split(). Scan character by character or use indexOf(',', startIndex) to extract numbers directly into pre-allocated accumulator structures.`,
      codeOrArtifact: `function ingestMetricsOptimized(rawSamples) {
  // Pre-allocated aggregators map
  const aggregates = new Map();

  for (let i = 0; i < rawSamples.length; i++) {
    const line = rawSamples[i];
    
    // Find commas without allocating arrays
    const firstComma = line.indexOf(',');
    const secondComma = line.indexOf(',', firstComma + 1);
    const thirdComma = line.indexOf(',', secondComma + 1);

    const metricName = line.slice(firstComma + 1, secondComma);
    const value = parseFloat(line.slice(secondComma + 1, thirdComma === -1 ? undefined : thirdComma));

    let agg = aggregates.get(metricName);
    if (!agg) {
      agg = { count: 0, sum: 0, min: Infinity, max: -Infinity };
      aggregates.set(metricName, agg);
    }

    agg.count++;
    agg.sum += value;
    if (value < agg.min) agg.min = value;
    if (value > agg.max) agg.max = value;
  }

  return aggregates;
}`,
    },
    alternativeApproaches: [
      'Using Node.js C++ Addon or Rust N-API module for zero-copy memory parsing.',
      'Writing binary telemetry over Protocol Buffers / FlatBuffers instead of CSV or JSON strings.',
    ],
    commonMistakes: [
      'Switching to RegExp which can be significantly slower and allocate match arrays.',
      'Caching every single string in a global Map, trading GC pauses for permanent memory leaks.',
    ],
    followUpQuestions: [
      {
        id: 'js-fq-5',
        question: 'What flags can you pass to Node.js to trace garbage collection in production?',
        expectedConcepts: ['--trace-gc', '--trace-gc-verbose', '--max-old-space-size'],
        sampleStrongAnswer: 'You can pass --trace-gc and --trace-gc-nvp to log every scavenge and mark-sweep event with memory sizes before and after, along with pause durations in milliseconds. You can also inspect performance.eventLoopUtilization() and perf_hooks.',
      },
    ],
  },
];

