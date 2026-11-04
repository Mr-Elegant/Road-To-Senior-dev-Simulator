# Reference: Advisory Locks: Application-Level Distributed Locking in Postgres

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Advisory Locks vs Row-Level Locks:**\n- Row-level locks (`FOR UPDATE`) require an actual physical row in a table. They create tuple-level write locks and record XIDs in heap pages.\n- Advisory Locks are lightweight, application-defined locks stored purely in the server’s shared memory lock table (the `PROCLOCK` / `LOCK` structures). They do not require any table or row and do not touch disk.\n- They take an arbitrary 64-bit integer (or two 32-bit integers) as the lock identifier (e.g. hash of entity name + ID).\n\n**2. Transaction-Level vs Session-Level:**\n- `pg_advisory_xact_lock(key)`: Automatically released when the surrounding transaction commits or rolls back. Safe against connection leaks, ideal for short-lived business operations.\n- `pg_advisory_lock(key)`: Tied to the client database session (TCP connection). Persists across transactions until explicitly released with `pg_advisory_unlock(key)` or until the connection terminates. Dangerous with connection poolers like PgBouncer in transaction pooling mode.\n\n**3. Blocking vs Non-Blocking:**\n- `pg_advisory_xact_lock(key)`: Blocks and waits until the lock is available.\n- `pg_try_advisory_xact_lock(key)`: Returns `TRUE` immediately if lock acquired; returns `FALSE` immediately without waiting if already held by another session. Ideal for cron jobs that should skip if already running.",
    "followUp": {
      "question": "What disaster occurs if an application uses session-level `pg_advisory_lock()` through PgBouncer configured in `pool_mode = transaction`?",
      "expectedAnswer": "In transaction pooling mode, PgBouncer assigns a backend server connection to a client for only a single transaction, then returns that connection to the pool for reuse by any other client. The session-level advisory lock remains active on that backend connection, causing subsequent unrelated transactions from different users to fail or inherit unauthorized lock state."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 20,
    "criteria": [
      "Differentiates in-memory advisory locks from row-level locks",
      "Distinguishes transaction-level from session-level lifecycles",
      "Explains non-blocking pg_try variants",
      "Warns about session advisory lock danger with PgBouncer transaction pooling"
    ]
  },
  "expectedConcepts": [
    "In-memory lock table without table/row dependency",
    "64-bit integer or (int4, int4) key space",
    "Transaction-scoped (xact) vs session-scoped locks",
    "pg_try_advisory_xact_lock non-blocking semantics for idempotent jobs",
    "PgBouncer transaction-mode danger with session-level advisory locks"
  ]
}
```
