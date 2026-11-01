import { PracticeProblem } from '@/types/practice';

export const practiceProblems: PracticeProblem[] = [
  // ===================== JAVASCRIPT =====================
  {
    id: 'js-debounce-options',
    title: 'Advanced Debounce with Leading & Trailing Options',
    language: 'javascript',
    difficulty: 'Senior',
    category: 'Async & Concurrency',
    estimatedMinutes: 25,
    description: `Implement an enterprise-grade \`debounce(func, wait, options)\` utility.
The function delays invoking \`func\` until after \`wait\` milliseconds have elapsed since the last time it was invoked.

Options:
- \`leading\` (boolean, default false): Specify invoking on the leading edge of the timeout.
- \`trailing\` (boolean, default true): Specify invoking on the trailing edge of the timeout.

Must support:
- \`debounced.cancel()\`: Cancels pending invocation.
- \`debounced.flush()\`: Immediately executes pending invocation and returns result.`,
    constraints: [
      'Must maintain lexical `this` and arguments.',
      'Must not trigger trailing call if only 1 leading call occurred within the wait window.',
      'Timer must be cleaned up on cancel() without memory leaks.',
    ],
    sampleInput: 'Wait: 50ms, options: { leading: true, trailing: false }',
    sampleOutput: 'Invoked immediately on first call, subsequent calls within 50ms ignored',
    starterCode: `/**
 * Implement debounce with leading and trailing edge options
 */
function debounce(func, wait, options = {}) {
  const leading = Boolean(options.leading);
  const trailing = options.trailing !== undefined ? Boolean(options.trailing) : true;
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  let lastCallTime = null;

  function debounced(...args) {
    // TODO: Implement timer management, leading/trailing execution
  }

  debounced.cancel = function() {
    // TODO: Cancel timer
  };

  debounced.flush = function() {
    // TODO: Flush pending execution
  };

  return debounced;
}

// Test harness entrypoint
function solution(mode) {
  let callCount = 0;
  const fn = () => ++callCount;
  
  if (mode === 'leading_only') {
    const debounced = debounce(fn, 20, { leading: true, trailing: false });
    debounced();
    debounced();
    return callCount; // Should be 1
  }

  if (mode === 'cancel_pending') {
    const debounced = debounce(fn, 50, { leading: false, trailing: true });
    debounced();
    debounced.cancel();
    return callCount; // Should be 0
  }
  
  return "configured";
}`,
    testCases: [
      {
        id: 'tc-deb-1',
        name: 'Leading only invocation executes exactly once immediately',
        inputDescription: '"leading_only"',
        expectedOutput: '1',
        explanation: 'Leading edge fires on first call; subsequent calls within wait window are suppressed.',
      },
      {
        id: 'tc-deb-2',
        name: 'Cancels scheduled trailing execution before timer expiration',
        inputDescription: '"cancel_pending"',
        expectedOutput: '0',
        explanation: 'cancel() clears pending timers so trailing callback never executes.',
      },
    ],
    hints: [
      'Keep track of whether a timer is currently active. If no timer is active and `leading: true`, execute immediately.',
      'On trailing edge, execute `func` only if `trailing: true` and arguments were recorded during the wait window.',
    ],
    referenceSolution: {
      code: `function debounce(func, wait, options = {}) {
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  const leading = Boolean(options.leading);
  const trailing = options.trailing !== undefined ? Boolean(options.trailing) : true;

  function invoke() {
    if (trailing && lastArgs) {
      func.apply(lastThis, lastArgs);
    }
    timerId = null;
    lastArgs = null;
    lastThis = null;
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    const isInvokingLeading = leading && !timerId;

    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(invoke, wait);

    if (isInvokingLeading) {
      func.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
  }

  debounced.cancel = () => {
    if (timerId) clearTimeout(timerId);
    timerId = null;
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = () => {
    if (timerId && lastArgs) {
      clearTimeout(timerId);
      invoke();
    }
  };

  return debounced;
}

function solution(mode) {
  let callCount = 0;
  const fn = () => ++callCount;
  if (mode === 'leading_only') {
    const debounced = debounce(fn, 20, { leading: true, trailing: false });
    debounced();
    debounced();
    return callCount;
  }
  if (mode === 'cancel_pending') {
    const debounced = debounce(fn, 50, { leading: false, trailing: true });
    debounced();
    debounced.cancel();
    return callCount;
  }
  return 0;
}`,
      explanation: 'Carefully tracks whether the leading call has already been triggered, resetting pointers on flush and cancel to avoid multiple executions.',
      timeComplexity: 'O(1) invocation overhead',
      spaceComplexity: 'O(1) closure retention',
    },
  },
  {
    id: 'js-promise-concurrency-pool',
    title: 'Async Promise Concurrency Pool (Worker Throttler)',
    language: 'javascript',
    difficulty: 'Senior',
    category: 'Async & Concurrency',
    estimatedMinutes: 30,
    description: `Build a Promise concurrency limiter \`pLimit(concurrency)\`.
It returns a wrapper function \`limit(asyncTask)\` that guarantees at most \`concurrency\` asynchronous tasks run in parallel.
Subsequent tasks are queued in FIFO order and executed as prior tasks resolve or reject.`,
    constraints: [
      'Strictly enforce maximum parallel executions (never exceed concurrency limit).',
      'Tasks that reject must propagate the error to the caller without stalling the remaining queue.',
      'Queue entries must be processed in strict FIFO sequence.',
    ],
    sampleInput: 'Concurrency: 2, Tasks: 5 async tasks taking 20ms each',
    sampleOutput: 'Tasks 1 & 2 execute first; task 3 starts only after 1 or 2 finishes',
    starterCode: `/**
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
}`,
    testCases: [
      {
        id: 'tc-pool-1',
        name: 'Enforces concurrency bound of 2 across 6 parallel tasks',
        inputDescription: '2',
        expectedOutput: '2',
        explanation: 'Active concurrent operations never exceed the configured limit of 2.',
      },
      {
        id: 'tc-pool-2',
        name: 'Enforces concurrency bound of 3 across 6 parallel tasks',
        inputDescription: '3',
        expectedOutput: '3',
        explanation: 'Active concurrent operations never exceed the configured limit of 3.',
      },
    ],
    hints: [
      'Maintain an internal `activeCount` integer and a FIFO array of deferred execution functions.',
      'Always call `next()` in a `.finally()` block so errors don\'t halt the queue.',
    ],
    referenceSolution: {
      code: `function pLimit(concurrency) {
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
}`,
      explanation: 'Encapsulates a deferred promise executor in a queue with strict decrement in finally blocks, mirroring the industry standard p-limit library.',
      timeComplexity: 'O(1) enqueue/dequeue overhead',
      spaceComplexity: 'O(N) queue storage',
    },
  },

  // ===================== TYPESCRIPT =====================
  {
    id: 'ts-deep-flatten-keys',
    title: 'Deep Nested Object Path Keys Union Type',
    language: 'typescript',
    difficulty: 'Senior',
    category: 'Type System',
    estimatedMinutes: 25,
    description: `Create a recursive TypeScript utility type \`PathKeys<T>\` that generates a union of all dot-separated object path strings for a deeply nested object interface.

Example:
\`\`\`typescript
interface Config {
  server: { host: string; port: number };
  db: { primary: { url: string } };
}
type Keys = PathKeys<Config>;
// Result: "server" | "server.host" | "server.port" | "db" | "db.primary" | "db.primary.url"
\`\`\``,
    constraints: [
      'Must recursively traverse nested object properties.',
      'Must handle primitive leaves without appending trailing dots.',
      'Must work for interfaces with 3+ levels of nesting.',
    ],
    sampleInput: 'Nested configuration interface',
    sampleOutput: 'Union of all nested dot paths: "db.primary.url"',
    starterCode: `/**
 * Recursive PathKeys Utility Type
 */
type PathKeys<T> = T extends object
  ? {
      [K in keyof T & string]: K | \`\${K}.\${PathKeys<T[K]>}\`;
    }[keyof T & string]
  : never;

// Verification runtime helper
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function solution(path: string = 'auth.jwt.issuer') {
  const config = {
    auth: {
      jwt: {
        issuer: 'auth.enterprise.io',
        expiry: '1h'
      }
    },
    database: {
      pool: {
        max: 20
      }
    }
  };

  const val = getNestedValue(config, path || 'auth.jwt.issuer');
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
}`,
    testCases: [
      {
        id: 'tc-path-1',
        name: 'Resolves deeply nested auth.jwt.issuer path key',
        inputDescription: '"auth.jwt.issuer"',
        expectedOutput: 'auth.enterprise.io',
        explanation: 'Deep property access succeeds safely.',
      },
      {
        id: 'tc-path-2',
        name: 'Resolves nested database.pool.max numeric key',
        inputDescription: '"database.pool.max"',
        expectedOutput: '20',
        explanation: 'Deep property access returns numeric primitive stringified.',
      },
    ],
    hints: [
      'Use mapped types over `keyof T & string`.',
      'For each key `K`, construct the template literal union: `K | \`\${K}.\${PathKeys<T[K]>}\` `.',
    ],
    referenceSolution: {
      code: `type PathKeys<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? K | \`\${K}.\${PathKeys<T[K]>}\`
        : K;
    }[keyof T & string]
  : never;

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function solution(path: string = 'auth.jwt.issuer') {
  const config = {
    auth: {
      jwt: {
        issuer: 'auth.enterprise.io',
        expiry: '1h'
      }
    },
    database: {
      pool: {
        max: 20
      }
    }
  };

  const val = getNestedValue(config, path || 'auth.jwt.issuer');
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
}`,
      explanation: 'Maps over string keys, recursively checking if the value is an object. If so, unions the current key with the key concatenated with recursive sub-paths.',
      timeComplexity: 'Compile-time type evaluation',
    },
  },

  // ===================== SQL =====================
  {
    id: 'sql-monthly-cohort-retention',
    title: 'Monthly User Cohort Retention & Churn Analysis',
    language: 'sql',
    difficulty: 'Senior',
    category: 'SQL Aggregations & Joins',
    estimatedMinutes: 30,
    description: `A subscription SaaS platform analyzes customer retention month-over-month.
Write a SQL query that calculates the active cohort user count for each cohort month (based on user signup date) and their recurring retention in subsequent months.

Database Tables:
1. \`users\` (id INT, email VARCHAR, signup_date DATE)
2. \`activity\` (id INT, user_id INT, activity_date DATE)

Output Requirements:
Return columns:
- \`cohort_month\`: The YYYY-MM formatted signup month of the cohort.
- \`active_month\`: The YYYY-MM formatted activity month.
- \`retained_users\`: Count of unique users from that cohort who performed an activity in that active month.
Order by \`cohort_month\` ASC, \`active_month\` ASC.`,
    constraints: [
      'Only count distinct users per active month.',
      'Format dates as YYYY-MM (e.g. `2026-01`).',
      'Filter out activity prior to user signup date.',
    ],
    sampleInput: 'Users signed up in 2026-01 who logged in during 2026-01 and 2026-02',
    sampleOutput: '[{"cohort_month":"2026-01","active_month":"2026-01","retained_users":2},{"cohort_month":"2026-01","active_month":"2026-02","retained_users":1}]',
    sqlSetup: [
      {
        tableName: 'users',
        schemaSql: 'CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(100), signup_date DATE);',
        seedDataSql: `
          INSERT INTO users VALUES (1, 'alice@acme.com', '2026-01-05');
          INSERT INTO users VALUES (2, 'bob@acme.com', '2026-01-15');
          INSERT INTO users VALUES (3, 'charlie@acme.com', '2026-02-01');
        `,
      },
      {
        tableName: 'activity',
        schemaSql: 'CREATE TABLE activity (id INT PRIMARY KEY, user_id INT, activity_date DATE);',
        seedDataSql: `
          INSERT INTO activity VALUES (101, 1, '2026-01-08');
          INSERT INTO activity VALUES (102, 1, '2026-02-12');
          INSERT INTO activity VALUES (103, 2, '2026-01-18');
          INSERT INTO activity VALUES (104, 3, '2026-02-05');
        `,
      },
    ],
    starterCode: `-- Calculate monthly cohort retention
SELECT 
  -- Format cohort_month and active_month as YYYY-MM
  SUBSTRING(u.signup_date, 1, 7) AS cohort_month,
  SUBSTRING(a.activity_date, 1, 7) AS active_month,
  COUNT(DISTINCT u.id) AS retained_users
FROM users u
JOIN activity a ON u.id = a.user_id
WHERE a.activity_date >= u.signup_date
GROUP BY cohort_month, active_month
ORDER BY cohort_month ASC, active_month ASC;`,
    testCases: [
      {
        id: 'tc-sql-1',
        name: 'Calculates cohort retention counts for January and February cohorts',
        inputDescription: '',
        expectedOutput: '[{"cohort_month":"2026-01","active_month":"2026-01","retained_users":2},{"cohort_month":"2026-01","active_month":"2026-02","retained_users":1},{"cohort_month":"2026-02","active_month":"2026-02","retained_users":1}]',
        explanation: 'Cohort 2026-01 has 2 active users in Jan, 1 in Feb. Cohort 2026-02 has 1 active user in Feb.',
      },
      {
        id: 'tc-sql-2',
        name: 'Calculates cohort retention including additional active cohort user',
        inputDescription: "INSERT INTO activity (id, user_id, activity_date) VALUES (8, 2, '2026-02-20');",
        expectedOutput: '[{"cohort_month":"2026-01","active_month":"2026-01","retained_users":2},{"cohort_month":"2026-01","active_month":"2026-02","retained_users":2},{"cohort_month":"2026-02","active_month":"2026-02","retained_users":1}]',
        explanation: 'User 2 from the January cohort logs activity in February, incrementing January cohort retention to 2.',
      },
    ],
    hints: [
      'Extract the month prefix using `SUBSTRING(date_column, 1, 7)` or `strftime` / `to_char`.',
      'Use `COUNT(DISTINCT u.id)` to avoid counting duplicate logins by the same user in the same month.',
    ],
    referenceSolution: {
      code: `SELECT 
  SUBSTRING(u.signup_date, 1, 7) AS cohort_month,
  SUBSTRING(a.activity_date, 1, 7) AS active_month,
  COUNT(DISTINCT u.id) AS retained_users
FROM users u
INNER JOIN activity a ON u.id = a.user_id
WHERE a.activity_date >= u.signup_date
GROUP BY SUBSTRING(u.signup_date, 1, 7), SUBSTRING(a.activity_date, 1, 7)
ORDER BY cohort_month ASC, active_month ASC;`,
      explanation: 'Joins users to their activity records, truncates dates to YYYY-MM, groups by both cohort and activity months, and counts distinct users per bucket.',
      timeComplexity: 'O(N log N) grouping & sort',
    },
  },
  {
    id: 'sql-top-n-per-category',
    title: 'Top 2 Revenue Products Per Category (Window Functions)',
    language: 'sql',
    difficulty: 'Senior',
    category: 'Window Functions',
    estimatedMinutes: 25,
    description: `An e-commerce marketplace needs to identify the top 2 highest-grossing products in every category.
In the event of identical revenues, both products should receive the same rank without skipping rank numbers (\`DENSE_RANK\`).

Database Tables:
1. \`categories\` (id INT, name VARCHAR)
2. \`products\` (id INT, category_id INT, title VARCHAR, revenue INT)

Output Requirements:
Return columns:
- \`category_name\`: Name of the product category
- \`product_title\`: Title of the product
- \`revenue\`: Product revenue
- \`ranking\`: The dense rank (1 or 2) within that category
Order by \`category_name\` ASC, \`ranking\` ASC, \`revenue\` DESC.`,
    constraints: [
      'Must use SQL Window function DENSE_RANK() OVER (PARTITION BY ... ORDER BY ...).',
      'Filter output to ranking <= 2.',
    ],
    sampleInput: 'Electronics and Apparel products with varied revenues',
    sampleOutput: 'Top 2 products per category ordered by dense rank',
    sqlSetup: [
      {
        tableName: 'categories',
        schemaSql: 'CREATE TABLE categories (id INT PRIMARY KEY, name VARCHAR(50));',
        seedDataSql: `
          INSERT INTO categories VALUES (1, 'Electronics');
          INSERT INTO categories VALUES (2, 'Apparel');
        `,
      },
      {
        tableName: 'products',
        schemaSql: 'CREATE TABLE products (id INT PRIMARY KEY, category_id INT, title VARCHAR(100), revenue INT);',
        seedDataSql: `
          INSERT INTO products VALUES (10, 1, 'Laptop Pro', 50000);
          INSERT INTO products VALUES (11, 1, 'Wireless Mouse', 8000);
          INSERT INTO products VALUES (12, 1, '4K Monitor', 35000);
          INSERT INTO products VALUES (20, 2, 'Winter Jacket', 22000);
          INSERT INTO products VALUES (21, 2, 'Running Shoes', 18000);
          INSERT INTO products VALUES (22, 2, 'Cotton Socks', 3000);
        `,
      },
    ],
    starterCode: `-- Find top 2 products per category using DENSE_RANK
SELECT 
  c.name AS category_name,
  p.title AS product_title,
  p.revenue,
  DENSE_RANK() OVER (PARTITION BY p.category_id ORDER BY p.revenue DESC) AS ranking
FROM products p
JOIN categories c ON p.category_id = c.id;`,
    testCases: [
      {
        id: 'tc-sql-top2',
        name: 'Ranks top 2 products in Electronics (Laptop, Monitor) and Apparel (Jacket, Shoes)',
        inputDescription: '',
        expectedOutput: '[{"category_name":"Apparel","product_title":"Winter Jacket","revenue":22000,"ranking":1},{"category_name":"Apparel","product_title":"Running Shoes","revenue":18000,"ranking":2},{"category_name":"Electronics","product_title":"Laptop Pro","revenue":50000,"ranking":1},{"category_name":"Electronics","product_title":"4K Monitor","revenue":35000,"ranking":2}]',
        explanation: 'Accurately partitions by category and isolates the top 2 ranked items.',
      },
      {
        id: 'tc-sql-top-parka',
        name: 'Correctly ranks when a new high-revenue apparel product is added',
        inputDescription: "INSERT INTO products (id, category_id, title, revenue) VALUES (23, 2, 'Luxury Parka', 25000);",
        expectedOutput: '[{"category_name":"Apparel","product_title":"Luxury Parka","revenue":25000,"ranking":1},{"category_name":"Apparel","product_title":"Winter Jacket","revenue":22000,"ranking":2},{"category_name":"Electronics","product_title":"Laptop Pro","revenue":50000,"ranking":1},{"category_name":"Electronics","product_title":"4K Monitor","revenue":35000,"ranking":2}]',
        explanation: 'Dynamic ranking adapts as category leaders change.',
      },
    ],
    hints: [
      'Wrap the query with a Common Table Expression (CTE) or subquery: `WITH Ranked AS (...) SELECT ... WHERE ranking <= 2`.',
      'Window functions cannot be placed directly in a `WHERE` clause of the same query block.',
    ],
    referenceSolution: {
      code: `SELECT 
  category_name,
  product_title,
  revenue,
  ranking
FROM (
  SELECT 
    c.name AS category_name,
    p.title AS product_title,
    p.revenue,
    DENSE_RANK() OVER (PARTITION BY p.category_id ORDER BY p.revenue DESC) AS ranking
  FROM products p
  JOIN categories c ON p.category_id = c.id
) ranked
WHERE ranking <= 2
ORDER BY category_name ASC, ranking ASC, revenue DESC;`,
      explanation: 'Uses a subquery to compute the window function DENSE_RANK partitioned by category, then filters ranking <= 2 in the outer query.',
      timeComplexity: 'O(N log N) partitioned window sort',
    },
  },

  // ===================== UNCONFIGURED / REMOTE LANGUAGE =====================
  {
    id: 'py-token-bucket-limiter',
    title: 'Python Token Bucket Distributed Rate Limiter',
    language: 'python',
    difficulty: 'Senior',
    category: 'Remote Service / Sandboxing',
    estimatedMinutes: 20,
    description: `Implement a Token Bucket rate limiter in Python for distributed microservices.
This challenge demonstrates how unconfigured remote execution environments are safely and transparently surfaced to candidates without executing arbitrary code on the application server.`,
    constraints: [
      'Refills tokens monotonically based on elapsed time.',
      'Thread-safe token debiting.',
    ],
    sampleInput: 'capacity=10, refill_rate=2/sec',
    sampleOutput: 'True for first 10 requests, False on 11th request until refill',
    starterCode: `import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = time.time()

    def consume(self, amount: int = 1) -> bool:
        # TODO: Implement token refill and debit
        return True
`,
    testCases: [
      {
        id: 'tc-py-1',
        name: 'Consumes tokens within capacity bound',
        inputDescription: 'consume(1)',
        expectedOutput: 'True',
        explanation: 'Tokens are debited when capacity is available.',
      },
      {
        id: 'tc-py-2',
        name: 'Rejects consumption when capacity is exceeded',
        inputDescription: 'consume(100)',
        expectedOutput: 'False',
        explanation: 'Exceeding bucket capacity returns False.',
      },
    ],
    hints: [
      'In production, containerized sandboxes (gVisor / Firecracker microVMs) execute non-JS languages with strict network and CPU limits.',
      'Review the reference Python solution and compare against your architectural design.',
    ],
    referenceSolution: {
      code: `import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = time.time()

    def consume(self, amount: int = 1) -> bool:
        now = time.time()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now

        if self.tokens >= amount:
            self.tokens -= amount
            return True
        return False`,
      explanation: 'Calculates fractional tokens generated based on elapsed time delta, bounds tokens at maximum bucket capacity, and debits requested tokens.',
      timeComplexity: 'O(1)',
    },
  },
];

export const practiceProblemMap = new Map<string, PracticeProblem>();
for (const p of practiceProblems) {
  practiceProblemMap.set(p.id, p);
}
