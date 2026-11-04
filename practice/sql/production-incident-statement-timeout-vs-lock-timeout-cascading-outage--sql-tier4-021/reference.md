# Reference: Production Incident: Statement Timeout vs Lock Timeout Cascading Outage

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. The Lock Queue Pileup Phenomenon (FIFO Queuing):**\n- When `ALTER TABLE` runs, it requests an `ACCESS EXCLUSIVE` lock on `orders`.\n- If any concurrent read (`SELECT`) query is currently active, the DDL cannot acquire the lock immediately and sits in the lock queue waiting.\n- **The Critical Trap**: While the DDL is waiting in the queue, **all subsequent incoming queries (`SELECT`, `INSERT`, `UPDATE`) queue behind the waiting DDL**, even though they only need `AccessShareLock`!\n- PostgreSQL does this intentionally to prevent exclusive locks from being starved indefinitely by a constant stream of reads. However, it means a waiting DDL halts all traffic to the table.\n\n**2. Why `statement_timeout` Failed:**\n- With `statement_timeout = 5s`, the DDL queued for 5 full seconds before timing out.\n- During those 5 seconds, every incoming checkout and payment query queued behind it, piling up until connection pools were exhausted and clients timed out.\n\n**3. The Solution: `lock_timeout`:**\n- `lock_timeout` controls how long a statement will wait to **acquire a lock** before aborting, independent of execution time.\n- **Safe Zero-Downtime DDL Pattern**:\n```sql\n-- Set a tiny lock timeout (e.g. 500ms)\nSET lock_timeout = '500ms';\n\n-- Attempt DDL; if lock cannot be acquired within 500ms, abort immediately rather than blocking traffic\nALTER TABLE orders ADD COLUMN flags INT;\n```\nIf it fails due to lock contention, the application script sleeps with random jitter and retries, ensuring production reads and writes are never blocked for more than 500 milliseconds.",
    "followUp": {
      "question": "What is the difference between `lock_timeout`, `statement_timeout`, and `idle_in_transaction_session_timeout`?",
      "expectedAnswer": "`lock_timeout` limits how long a query waits to acquire any lock. `statement_timeout` limits total wall-clock query duration (lock wait time + actual execution time). `idle_in_transaction_session_timeout` limits how long a connection can sit idle after opening a transaction (`BEGIN`) without issuing another query, preventing abandoned transactions from pinning locks and the xmin horizon."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains FIFO lock queueing and why waiting exclusive lock blocks reads",
      "Differentiates statement_timeout from lock_timeout",
      "Provides safe DDL script with SET lock_timeout = '500ms'",
      "Itemizes the three timeouts and their specific scopes"
    ]
  },
  "expectedConcepts": [
    "FIFO lock queue mechanics and exclusive lock blocking subsequent reads",
    "Difference between statement_timeout (execution + lock) and lock_timeout (lock wait only)",
    "Why waiting DDL starves all incoming traffic",
    "Safe DDL pattern setting lock_timeout = 500ms with retry loops",
    "Preventing API connection exhaustion during schema maintenance"
  ]
}
```
