import { Scenario } from '@/types/scenario';

export const databaseScenarios: Scenario[] = [
  {
    id: 'db-deadlock-inventory-reservation',
    title: 'Flash Sale Cart Reservation PostgreSQL Transaction Deadlock',
    type: 'debugging',
    topic: 'Databases',
    subtopic: 'Deadlocks',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'During a flash sale, shoppers simultaneously checkout carts containing multiple shared items (e.g. Shoes + Socks). Under peak concurrency, PostgreSQL logs show surging `ERROR: deadlock detected (SQLSTATE 40P01)`, causing 15% of checkout transactions to fail and abort.',
    problemStatement:
      'When two concurrent checkout transactions attempt to lock the same inventory rows in different orders (Transaction A locks Product #101 then Product #205; Transaction B locks Product #205 then Product #101), neither transaction can proceed, causing a cyclical deadlock. Refactor the reservation logic to guarantee deterministic lock ordering.',
    constraints: [
      'Must eliminate deadlocks completely.',
      'Must maintain strict inventory consistency (no overselling beyond available stock).',
      'Use deterministic sorting by Primary Key before locking (`SELECT ... FOR UPDATE`).',
    ],
    starterCode: `/**
 * Deadlock-Prone Multi-Item Inventory Reservation
 */
async function reserveInventoryItems(client, itemsToReserve) {
  // itemsToReserve = [{ productId: 205, qty: 1 }, { productId: 101, qty: 2 }]
  
  await client.query('BEGIN');
  
  // BUG: Locks items in arbitrary array order provided by client payload!
  // If User 1 reserves [101, 205] while User 2 reserves [205, 101],
  // PostgreSQL detects a cyclical dependency and terminates one with SQLSTATE 40P01.
  for (const item of itemsToReserve) {
    const res = await client.query(
      'SELECT stock FROM inventory WHERE product_id = $1 FOR UPDATE',
      [item.productId]
    );
    if (res.rows[0].stock < item.qty) {
      throw new Error(\`Insufficient stock for product \${item.productId}\`);
    }
    await client.query(
      'UPDATE inventory SET stock = stock - $1 WHERE product_id = $2',
      [item.qty, item.productId]
    );
  }

  await client.query('COMMIT');
}

function solution(input) {
  return "deterministic_lock_ordering_applied";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Analyze PostgreSQL deadlock error logs and explain the Coffman conditions required for deadlocks.',
      'Enforce deterministic lock acquisition ordering by sorting item IDs before executing `SELECT ... FOR UPDATE`.',
      'Discuss alternative lock acquisition methods like `SELECT ... FOR UPDATE NOWAIT` or `SKIP LOCKED`.',
    ],
    hints: [
      'If all concurrent transactions always acquire locks in the exact same global order (e.g. sorted ascending by `product_id`), a circular dependency cannot form.',
      'You can sort `itemsToReserve.sort((a, b) => a.productId - b.productId)` before the loop or execute a single query: `SELECT ... WHERE product_id IN (...) ORDER BY product_id FOR UPDATE`.',
    ],
    testCases: [
      {
        id: 'tc-deadlock-1',
        name: 'Enforces deterministic primary key lock ordering',
        inputDescription: 'null',
        expectedOutput: '"deterministic_lock_ordering_applied"',
        explanation: 'Guarantees deadlocks cannot occur across concurrent reservations.',
      },
    ],
    rubric: [
      {
        id: 'rb-deadlock-ordering',
        category: 'root_cause',
        label: 'Deadlock Formation & Coffman Conditions',
        description: 'Explains circular wait condition and deterministic lock ordering solution.',
        weight: 5,
        levels: [
          { score: 3, description: 'Details circular wait condition, sorts IDs before locking, explains SELECT FOR UPDATE semantics.' },
          { score: 2, description: 'Sorts array but misses single-query lock optimization.' },
          { score: 0, description: 'Suggests retry logic as only solution without eliminating deadlock root cause.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `A deadlock occurs when two or more transactions hold locks that each other need, creating a circular wait graph:
Transaction 1 holds exclusive lock on Product 101 and waits for Product 205.
Transaction 2 holds exclusive lock on Product 205 and waits for Product 101.
PostgreSQL deadlock detector wakes up (after deadlock_timeout, default 1s) and aborts one transaction with error 40P01.
      
Fix:
Break the Circular Wait condition. If every transaction in the entire application locks rows in the exact same global deterministic order (e.g. sorted by product_id ASC), Transaction 2 will wait for Transaction 1 to finish with Product 101 before even attempting to touch Product 205. A cycle can never form.`,
      codeOrArtifact: `async function reserveInventoryDeterministic(client, itemsToReserve) {
  // Sort items deterministically by product_id ascending
  const sortedItems = [...itemsToReserve].sort((a, b) => a.productId - b.productId);

  await client.query('BEGIN');
  try {
    for (const item of sortedItems) {
      const res = await client.query(
        'SELECT stock FROM inventory WHERE product_id = $1 FOR UPDATE',
        [item.productId]
      );

      if (!res.rows[0] || res.rows[0].stock < item.qty) {
        throw new Error(\`Insufficient stock for product \${item.productId}\`);
      }

      await client.query(
        'UPDATE inventory SET stock = stock - $1 WHERE product_id = $2',
        [item.qty, item.productId]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}`,
    },
    alternativeApproaches: [
      'Single SQL statement batch update: UPDATE inventory SET stock = stock - updates.qty FROM ...',
      'Using Redis distributed locks with Redlock algorithm ordered by key.',
    ],
    commonMistakes: [
      'Relying solely on retry logic: retries without ordering can cause repeated lock thrashing under high concurrency.',
      'Using `SELECT ... FOR SHARE` which permits read sharing but escalates to exclusive write locks, actually increasing deadlocks.',
    ],
    followUpQuestions: [
      {
        id: 'db-fq-1',
        question: 'What is the purpose of `SELECT ... FOR UPDATE SKIP LOCKED` and where is it used?',
        expectedConcepts: ['Job queues / worker polling', 'Skips locked rows instead of waiting', 'Prevents worker lock contention'],
        sampleStrongAnswer: '`SKIP LOCKED` instructs the database to ignore rows that are currently locked by other concurrent transactions and return only available, unlocked rows. It is the gold standard for building high-concurrency database-backed job queues (like Celery, Graphile Worker, or BullMQ on Postgres) because workers never block each other.',
      },
    ],
  },
  {
    id: 'db-n-plus-one-query-plan',
    title: 'E-Commerce Order History Endpoint N+1 Query & Composite Index Optimization',
    type: 'debugging',
    topic: 'Databases',
    subtopic: 'Indexes and query plans',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'An e-commerce order history dashboard page (`/api/account/orders`) takes 14 seconds to load for loyal customers with 150 orders. Database CPU utilization reaches 98% during peak browsing hours.',
    problemStatement:
      'The ORM repository performs 1 query to fetch the user\'s orders, and then inside a loop executes separate SQL queries to fetch line items, shipping addresses, and tracking status for each individual order (N+1 query problem). Additionally, `EXPLAIN ANALYZE` shows a Sequential Scan on the 20-million row `orders` table because queries filter by `user_id` and sort by `created_at DESC` without a composite index.',
    constraints: [
      'Eliminate N+1 queries using `JOIN`, `DataLoader`, or batch `IN (...)` fetching.',
      'Design composite index to enable Index Only Scan or fast B-Tree index scan.',
      'Endpoint response time must drop under 80ms.',
    ],
    starterCode: `/**
 * Buggy N+1 Query Handler
 */
async function getUserOrderHistory(db, userId) {
  // Query 1: Seq Scan on orders (filters user_id, sorts created_at DESC)
  const orders = await db.query(
    'SELECT id, total_amount, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
    [userId]
  );

  // BUG: N additional queries executed in loop!
  for (const order of orders.rows) {
    const items = await db.query(
      'SELECT product_name, price, qty FROM order_items WHERE order_id = $1',
      [order.id]
    );
    order.items = items.rows;
  }

  return orders.rows;
}

function solution(input) {
  return "batch_join_with_composite_index";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain the N+1 query problem and how it impacts database connection pool latency.',
      'Refactor queries into either a single JOIN query with JSON aggregation (`json_agg`) or a 2-query batch fetch using `WHERE order_id = ANY($1)`.',
      'Provide the exact PostgreSQL DDL for the composite index: `CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC)`.',
    ],
    hints: [
      'In PostgreSQL, `json_agg` or `jsonb_agg` lets you fetch orders with their nested line items in a single query.',
      'A composite index `(user_id, created_at DESC)` satisfies both the WHERE filter and the ORDER BY sort without a temporary filesort.',
    ],
    testCases: [
      {
        id: 'tc-nplus-1',
        name: 'Combines queries and uses composite index',
        inputDescription: 'null',
        expectedOutput: '"batch_join_with_composite_index"',
        explanation: 'Replaces 51 queries with a single indexed query.',
      },
    ],
    rubric: [
      {
        id: 'rb-nplus-one',
        category: 'root_cause',
        label: 'N+1 Query & Indexing Architecture',
        description: 'Diagnoses N+1 round trips and designs optimal composite index.',
        weight: 5,
        levels: [
          { score: 3, description: 'Eliminates loop queries, writes composite index (user_id, created_at DESC), explains EXPLAIN ANALYZE.' },
          { score: 2, description: 'Fixes query with IN clause but forgets composite index.' },
          { score: 0, description: 'Leaves loop queries.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `1. N+1 Problem: For 50 orders, the code executed 1 initial query + 50 individual item queries = 51 database roundtrips. Even with a low 2ms network ping, 51 queries sequentially take 100ms+ just in network round trips, tying up database connections.
2. Missing Composite Index: 'WHERE user_id = $1 ORDER BY created_at DESC' requires the database to find rows matching user_id and sort them. Without an index on (user_id, created_at DESC), Postgres either does a Sequential Scan or an index scan on user_id followed by an in-memory Sort (quicksort or disk external sort).
      
Fix:
1. Index: CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
2. Query: Fetch orders and line items using JSON aggregation or 2 batch queries.`,
      codeOrArtifact: `/* DDL Composite Index */
-- CREATE INDEX CONCURRENTLY idx_orders_user_created ON orders (user_id, created_at DESC);
-- CREATE INDEX CONCURRENTLY idx_order_items_order_id ON order_items (order_id);

async function getUserOrderHistoryOptimized(db, userId) {
  const query = \`
    SELECT 
      o.id, 
      o.total_amount, 
      o.created_at,
      COALESCE(
        json_agg(
          json_build_object('product_name', i.product_name, 'price', i.price, 'qty', i.qty)
        ) FILTER (WHERE i.id IS NOT NULL), 
        '[]'
      ) as items
    FROM orders o
    LEFT JOIN order_items i ON o.id = i.order_id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT 50
  \`;

  const result = await db.query(query, [userId]);
  return result.rows;
}`,
    },
    alternativeApproaches: [
      'Two-query approach: Query 1 fetches 50 orders; Query 2 fetches items WHERE order_id = ANY(orderIds); stitch together in application memory.',
      'Using GraphQL / DataLoader to batch and cache item lookups.',
    ],
    commonMistakes: [
      'Creating two separate single-column indexes on user_id and created_at instead of a single composite index.',
      'Ordering index columns as (created_at, user_id), which does not help equality filtering on user_id.',
    ],
    followUpQuestions: [
      {
        id: 'db-fq-2',
        question: 'What is the "Equality, Sort, Range" (ESR) rule when designing composite indexes?',
        expectedConcepts: ['Equality columns first', 'Sort columns second', 'Range condition columns last'],
        sampleStrongAnswer: 'The ESR rule states that columns queried with exact equality (=) should appear first in the composite index, followed by columns used for sorting (ORDER BY), and finally columns filtered with inequality/range operators (<, >, BETWEEN). This allows the B-Tree index to perform a direct lookup, walk the sorted branch, and slice range values without additional filter passes.',
      },
    ],
  },
  {
    id: 'db-isolation-levels-phantom-read',
    title: 'Financial Ledger Wallet Balance Anomaly & Isolation Levels',
    type: 'debugging',
    topic: 'Databases',
    subtopic: 'Isolation levels',
    difficulty: 'Senior',
    estimatedMinutes: 30,
    businessContext:
      'A digital banking ledger enforces that a customer\'s balance can never drop below zero. Under concurrent withdrawal and transfer requests, users are able to overdraw their accounts into negative balances even though the application code checks `balance >= withdrawalAmount` before debiting.',
    problemStatement:
      'Under the default PostgreSQL `READ COMMITTED` isolation level, checking account balance with `SELECT sum(amount)` in one statement does not prevent another concurrent transaction from inserting a debit transaction before the current transaction executes `INSERT INTO transactions ...`. Diagnose the anomaly (Write Skew / Phantom Read) and compare resolution via `SERIALIZABLE` transactions vs pessimistic row locking (`SELECT FOR UPDATE`).',
    constraints: [
      'Account balance must NEVER drop below 0.',
      'Must analyze trade-offs between `SELECT ... FOR UPDATE` vs `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`.',
      'Explain how PostgreSQL detects serialization failures (SQLSTATE 40001) and how retry loops must be implemented.',
    ],
    starterCode: `/**
 * Anomaly-Prone Balance Withdrawal
 */
async function processWithdrawal(client, accountId, amount) {
  // Default isolation level: READ COMMITTED
  await client.query('BEGIN');

  // Step 1: Calculate current balance from ledger entries
  const res = await client.query(
    'SELECT COALESCE(SUM(amount), 0) AS balance FROM ledger_entries WHERE account_id = $1',
    [accountId]
  );
  const currentBalance = parseFloat(res.rows[0].balance);

  // BUG: Under READ COMMITTED, another concurrent transaction can commit a withdrawal right now!
  if (currentBalance < amount) {
    await client.query('ROLLBACK');
    throw new Error('Insufficient funds');
  }

  // Step 2: Insert debit
  await client.query(
    'INSERT INTO ledger_entries (account_id, amount, created_at) VALUES ($1, $2, NOW())',
    [accountId, -amount]
  );

  await client.query('COMMIT');
}

function solution(input) {
  return "pessimistic_lock_or_serializable_retry";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain why `READ COMMITTED` permits write skew / phantom calculations across multiple statements.',
      'Implement pessimistic locking using a parent `accounts` table row with `SELECT balance FROM accounts WHERE id = $1 FOR UPDATE`.',
      'Explain how `SERIALIZABLE` isolation solves this with Serializable Snapshot Isolation (SSI) and requires application-level retries on error 40001.',
    ],
    hints: [
      'You cannot lock rows that do not exist yet in `ledger_entries`, so locking an aggregate `SUM()` is impossible in SQL without table lock.',
      'Lock the parent account row: `SELECT * FROM accounts WHERE id = $1 FOR UPDATE`.',
    ],
    testCases: [
      {
        id: 'tc-iso-1',
        name: 'Prevents negative balance under concurrent race conditions',
        inputDescription: 'null',
        expectedOutput: '"pessimistic_lock_or_serializable_retry"',
        explanation: 'Enforces strict transactional guarantees against overdrafts.',
      },
    ],
    rubric: [
      {
        id: 'rb-isolation-levels',
        category: 'reliability',
        label: 'ACID Isolation Levels & Write Skew Analysis',
        description: 'Analyzes Read Committed, Repeatable Read, and Serializable guarantees.',
        weight: 5,
        levels: [
          { score: 3, description: 'Compares parent row locking (SELECT FOR UPDATE) vs SSI Serializable with 40001 retries.' },
          { score: 2, description: 'Fixes with parent row lock but unaware of Serializable isolation nuances.' },
          { score: 0, description: 'Fails to understand concurrency race condition.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Under READ COMMITTED (PostgreSQL's default), each query in a transaction sees a snapshot of data committed before that specific query began. If two transactions both read balance = \$100, both pass the 'balance >= \$80' check, and both insert a -\$80 debit, the final balance is -\$60 (overdraft).
      
Because 'SELECT SUM(amount) FROM ledger_entries' is an aggregate query, there is no single row to lock with 'FOR UPDATE' unless you lock the entire table (terrible for concurrency).
      
Two Production Solutions:
1. Pessimistic Parent Row Lock (Recommended for Ledgers): Maintain an 'accounts' table row. Lock that row: 'SELECT id FROM accounts WHERE id = $1 FOR UPDATE'. This serializes all debits and credits for that specific account while allowing other accounts to process in parallel.
2. Serializable Isolation Level: Set 'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE'. PostgreSQL will use SSI (Serializable Snapshot Isolation) to track predicate read/write dependencies. If two transactions conflict, one commits and the second is aborted with SQLSTATE 40001 ('could not serialize access'). The application must implement a retry loop with exponential backoff.`,
      codeOrArtifact: `async function processWithdrawalSafe(client, accountId, amount) {
  await client.query('BEGIN');
  try {
    // 1. Acquire exclusive pessimistic lock on the account record
    const accountCheck = await client.query(
      'SELECT id, balance FROM accounts WHERE id = $1 FOR UPDATE',
      [accountId]
    );

    if (accountCheck.rows.length === 0) {
      throw new Error('Account not found');
    }

    const currentBalance = parseFloat(accountCheck.rows[0].balance);
    if (currentBalance < amount) {
      throw new Error('Insufficient balance');
    }

    // 2. Insert immutable ledger entry
    await client.query(
      'INSERT INTO ledger_entries (account_id, amount, created_at) VALUES ($1, $2, NOW())',
      [accountId, -amount]
    );

    // 3. Update cached balance on parent account row
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, accountId]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}`,
    },
    alternativeApproaches: [
      'Database CHECK constraint: `CONSTRAINT balance_non_negative CHECK (balance >= 0)`.',
      'Optimistic concurrency with version column `UPDATE accounts SET balance = balance - $1, version = version + 1 WHERE id = $2 AND version = $3`.',
    ],
    commonMistakes: [
      'Assuming REPEATABLE READ prevents write skew: in Postgres, Repeatable Read prevents non-repeatable reads and phantom reads on existing rows, but still allows write skew anomalies.',
      'Not adding an application retry loop when choosing SERIALIZABLE.',
    ],
    followUpQuestions: [
      {
        id: 'db-fq-3',
        question: 'What is Write Skew and why does Repeatable Read not protect against it in PostgreSQL?',
        expectedConcepts: ['Disjoint writes satisfying same constraint', 'Each transaction reads what the other will write', 'Requires Serializable or row lock'],
        sampleStrongAnswer: 'Write Skew occurs when two concurrent transactions read overlapping data sets but write to disjoint rows, where the combined result violates an integrity constraint (classic medical on-call doctor example). In Repeatable Read, both transactions see their consistent snapshot and write without conflicting with existing row locks, allowing the constraint violation to commit.',
      },
    ],
  },
  {
    id: 'db-keyset-pagination-performance',
    title: 'CRM Million-Row Activity Log OFFSET Pagination Degradation',
    type: 'debugging',
    topic: 'Databases',
    subtopic: 'Pagination',
    difficulty: 'Senior',
    estimatedMinutes: 25,
    businessContext:
      'An enterprise CRM displays a historical audit trail containing 45,000,000 customer interaction events. When auditors navigate to page 5,000 (`OFFSET 100000 LIMIT 20`), the query takes 18 seconds, frequently hitting query timeouts and pegging DB IOPS at 100%.',
    problemStatement:
      'The API uses traditional `OFFSET / LIMIT` pagination. For `OFFSET 100000`, PostgreSQL must scan the index, fetch 100,020 rows from disk, count past the first 100,000 rows, discard them all, and return only the final 20 rows. Migrate the query to Keyset (Cursor-Based) Pagination using `(created_at, id) < ($cursor_created_at, $cursor_id)`.',
    constraints: [
      'Query execution time on deep pages (e.g. 500,000th item) must execute under 5ms.',
      'Must handle ties in `created_at` timestamps gracefully by including primary key `id` as tie-breaker.',
      'Eliminate full table / index scanning of discarded offset rows.',
    ],
    starterCode: `/**
 * Degrading OFFSET Pagination
 */
async function getAuditLogsOffset(db, tenantId, pageNumber = 1, pageSize = 20) {
  const offset = (pageNumber - 1) * pageSize;

  // BUG: OFFSET 100000 forces Postgres to read 100,020 rows and discard 100,000 of them!
  const query = \`
    SELECT id, event_name, created_at, actor 
    FROM audit_logs 
    WHERE tenant_id = $1 
    ORDER BY created_at DESC 
    LIMIT $2 OFFSET $3
  \`;

  return db.query(query, [tenantId, pageSize, offset]);
}

function solution(input) {
  return "keyset_cursor_pagination_implemented";
}`,
    codeLanguage: 'javascript',
    candidateTasks: [
      'Explain the algorithmic complexity of `OFFSET N LIMIT M` (O(N + M)) vs Keyset pagination (O(log N + M)).',
      'Refactor the SQL query to use cursor keyset: `WHERE tenant_id = $1 AND (created_at, id) < ($cursorTime, $cursorId) ORDER BY created_at DESC, id DESC LIMIT $pageSize`.',
      'Construct a composite index supporting this query: `(tenant_id, created_at DESC, id DESC)`.',
    ],
    hints: [
      'Keyset pagination uses the last seen item\'s values as a direct seek into the B-Tree index.',
      'Tuples in SQL: `(created_at, id) < ($cursor_time, $cursor_id)` allow multi-column cursor comparison in a single expression.',
    ],
    testCases: [
      {
        id: 'tc-keyset-1',
        name: 'Uses keyset cursor for constant time O(1) page access',
        inputDescription: 'null',
        expectedOutput: '"keyset_cursor_pagination_implemented"',
        explanation: 'Enables high-performance scrolling across millions of records.',
      },
    ],
    rubric: [
      {
        id: 'rb-keyset-pagination',
        category: 'code_quality',
        label: 'Keyset / Cursor Pagination Architecture',
        description: 'Implements tuple cursor comparison and appropriate composite B-Tree index.',
        weight: 5,
        levels: [
          { score: 3, description: 'Writes tuple comparison (created_at, id) < (...), includes tie-breaker id, specifies composite index.' },
          { score: 2, description: 'Filters only on created_at without tie-breaker id (causes skipped rows on timestamp ties).' },
          { score: 0, description: 'Keeps OFFSET.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Why OFFSET degrades:
SQL databases cannot jump directly to row 100,000 in an index without reading through the preceding 99,999 entries. 'OFFSET 100000 LIMIT 20' scans 100,020 tuples, discards 100,000 of them, and returns 20. The deeper the page, the worse the latency (O(N) complexity).
Additionally, if rows are inserted while a user navigates pages, OFFSET produces duplicate or skipped records.
      
Fix: Keyset Pagination (Cursor-Based)
Use the values of the last record on the current page as a cursor for the next page. The database uses the B-Tree index to seek directly to the exact point in the index in O(log N) time and reads only 20 rows.`,
      codeOrArtifact: `/* Composite Index */
-- CREATE INDEX idx_audit_logs_keyset ON audit_logs (tenant_id, created_at DESC, id DESC);

async function getAuditLogsKeyset(db, tenantId, cursor, limit = 20) {
  let query;
  let params;

  if (!cursor) {
    // First page
    query = \`
      SELECT id, event_name, created_at, actor 
      FROM audit_logs 
      WHERE tenant_id = $1 
      ORDER BY created_at DESC, id DESC 
      LIMIT $2
    \`;
    params = [tenantId, limit];
  } else {
    // Subsequent pages: seek directly using tuple comparison
    query = \`
      SELECT id, event_name, created_at, actor 
      FROM audit_logs 
      WHERE tenant_id = $1 
        AND (created_at, id) < ($2, $3)
      ORDER BY created_at DESC, id DESC 
      LIMIT $4
    \`;
    params = [tenantId, cursor.createdAt, cursor.id, limit];
  }

  const res = await db.query(query, params);
  const rows = res.rows;
  const nextCursor = rows.length === limit 
    ? { createdAt: rows[rows.length - 1].created_at, id: rows[rows.length - 1].id } 
    : null;

  return { rows, nextCursor };
}`,
    },
    alternativeApproaches: [
      'Deferred Join with OFFSET: `JOIN (SELECT id FROM audit_logs WHERE ... OFFSET ... LIMIT ...) ON ...` to avoid pulling wide columns.',
    ],
    commonMistakes: [
      'Not including a unique tie-breaker (like `id`): if multiple events share the exact same timestamp millisecond, `< created_at` skips records entirely.',
      'Attempting to allow random-access jumping to "Page 400" with keyset pagination (keyset is inherently sequential / cursor-based).',
    ],
    followUpQuestions: [
      {
        id: 'db-fq-4',
        question: 'When is OFFSET pagination still acceptable or preferred over Keyset pagination?',
        expectedConcepts: ['Small finite datasets (< 500 rows)', 'Random jump to page number UI requirements', 'Admin views with rarely updated tables'],
        sampleStrongAnswer: 'OFFSET pagination is acceptable for small, bounded datasets (e.g. fewer than 1,000 total rows) where users require a UI that allows jumping directly to arbitrary page numbers (e.g. Page 14) and where the table has negligible write traffic.',
      },
    ],
  },
  {
    id: 'db-zero-downtime-migration',
    title: '50M-Row User Schema Column Rename Zero-Downtime Migration',
    type: 'system_design',
    topic: 'Databases',
    subtopic: 'Migrations',
    difficulty: 'Senior',
    estimatedMinutes: 35,
    businessContext:
      'A social and commerce platform has 50,000,000 records in the `users` table. The engineering team needs to rename and split `full_name` into `first_name` and `last_name`. Running `ALTER TABLE users ADD COLUMN first_name ...; UPDATE users SET ...` in a single migration script locks the table exclusively for 25 minutes, taking the entire platform offline.',
    problemStatement:
      'Design a multi-phase, zero-downtime database migration strategy (Expand and Contract / Parallel Run pattern). Describe the schema changes, dual-writing application layer, backfill script with throttling, and final deprecation cleanup without locking production tables.',
    constraints: [
      'Zero downtime (zero table locks exceeding 100ms).',
      'Both old and new application versions must function concurrently during deployment.',
      'Backfill must not starve database replication lag or max out IOPS.',
    ],
    systemDesignReqs: {
      scale: '50 Million rows, 8,000 active writes/sec, PostgreSQL primary with 3 read replicas.',
      functional: [
        'Migrate full_name column into first_name and last_name columns.',
        'Backfill 50,000,000 historical rows with throttling.',
        'Support dual-writing and zero-downtime cutover across application rolling restarts.',
      ],
      nonFunctional: [
        'Zero downtime (no table locks > 100ms).',
        'Replication lag on read replicas must stay under 1 second.',
        'Backward and forward API compatibility across deployment versions.',
      ],
      assumptions: [
        'PostgreSQL version 14+ running on AWS RDS / Aurora.',
      ],
    },
    candidateTasks: [
      'Map out the 5 phases of the Expand and Contract (Parallel Run) migration pattern.',
      'Show how to add nullable columns without rewriting the table or acquiring heavy AccessExclusiveLocks.',
      'Design a background backfill script that batches updates in chunks of 1,000 with sleep intervals.',
      'Explain when to drop the old column and remove dual-writing code.',
    ],
    hints: [
      'Phase 1: Expand (add new nullable columns). Phase 2: Dual-write in app or trigger. Phase 3: Backfill historical rows in batches. Phase 4: Read from new columns. Phase 5: Contract (drop old columns).',
      'In PostgreSQL 11+, adding a column with a default value does NOT rewrite the table, but backfilling 50M rows in a single UPDATE will bloat WAL and hold locks.',
    ],
    rubric: [
      {
        id: 'rb-migration-phases',
        category: 'tradeoffs',
        label: 'Expand/Contract Migration Execution',
        description: 'Details Expand and Contract pattern with backward and forward compatibility.',
        weight: 5,
        levels: [
          { score: 3, description: 'All 5 phases meticulously planned: schema expand, dual-write, throttled backfill, read switch, contract.' },
          { score: 2, description: 'Mentions adding columns first, but suggests doing backfill in one big UPDATE.' },
          { score: 0, description: 'Suggests running ALTER TABLE and UPDATE during maintenance window.' },
        ],
      },
    ],
    referenceSolution: {
      explanation: `Running 'UPDATE users SET first_name = split_part(full_name, ' ', 1)' across 50 million rows writes 50 million new row versions (MVCC), generates gigabytes of WAL logs, and saturates disk I/O, while an ALTER TABLE locks the table against reads and writes.
      
Zero-Downtime Expand-and-Contract Architecture:
Phase 1: Expand Schema
- Run 'ALTER TABLE users ADD COLUMN first_name VARCHAR(100), ADD COLUMN last_name VARCHAR(100);' (Postgres adds nullable columns instantaneously without table rewrites).
Phase 2: Dual Write in Application
- Deploy Application v2: When new users register or update profiles, write to BOTH 'full_name' AND ('first_name', 'last_name').
- Reads still query 'full_name'.
Phase 3: Backfill Historical Data
- Run an asynchronous worker script in off-peak hours.
- Updates records in chunks of 1,000 by primary key with 50ms pauses:
  'UPDATE users SET first_name = ..., last_name = ... WHERE id BETWEEN $start AND $end AND first_name IS NULL;'
- Monitor Postgres replication lag and autovacuum.
Phase 4: Switch Reads
- Deploy Application v3: Reads now query 'first_name' and 'last_name'. Stop writing to 'full_name'.
Phase 5: Contract
- Deploy Application v4: Remove all code references to 'full_name'.
- Drop the old column: 'ALTER TABLE users DROP COLUMN full_name;'`,
      codeOrArtifact: `/**
 * Safe Throttled Backfill Worker Script
 */
async function backfillUserData(db) {
  const BATCH_SIZE = 1000;
  let cursorId = 0;
  let hasMore = true;

  while (hasMore) {
    const res = await db.query(
      \`SELECT id, full_name 
       FROM users 
       WHERE id > $1 AND first_name IS NULL 
       ORDER BY id ASC 
       LIMIT $2\`,
      [cursorId, BATCH_SIZE]
    );

    if (res.rows.length === 0) {
      hasMore = false;
      break;
    }

    for (const row of res.rows) {
      const parts = (row.full_name || '').trim().split(' ');
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';

      await db.query(
        'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3',
        [firstName, lastName, row.id]
      );
      cursorId = row.id;
    }

    // Sleep 50ms to yield I/O and prevent replication lag
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}`,
    },
    alternativeApproaches: [
      'Using PostgreSQL database triggers for dual-writing during the transition instead of application code.',
      'Using tools like `pg-online-schema-change` or GitHub\'s `gh-ost` for MySQL.',
    ],
    commonMistakes: [
      'Adding a NOT NULL constraint without a default during Phase 1 (causes immediate deployment failure for existing rows and old app versions).',
      'Running backfills without sleeping or chunking, triggering replica lag alerts and disk fillups.',
    ],
    followUpQuestions: [
      {
        id: 'db-fq-5',
        question: 'Why should you always create indexes using `CREATE INDEX CONCURRENTLY` in PostgreSQL production?',
        expectedConcepts: ['Standard CREATE INDEX locks table for writes (ShareLock)', 'CONCURRENTLY builds index without write locks', 'Requires 2 table scans'],
        sampleStrongAnswer: 'Standard `CREATE INDEX` acquires a `SHARE` lock on the table, which permits reads but blocks all concurrent `INSERT`, `UPDATE`, and `DELETE` queries until the entire index build finishes. On a 50M-row table, this can lock out writes for 10-20 minutes. `CREATE INDEX CONCURRENTLY` builds the index using two separate table scans without blocking writes.',
      },
    ],
  },
];
