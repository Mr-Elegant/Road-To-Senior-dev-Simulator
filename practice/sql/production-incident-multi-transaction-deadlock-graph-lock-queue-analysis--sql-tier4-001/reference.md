# Reference: Production Incident: Multi-Transaction Deadlock Graph & Lock Queue Analysis

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Lock Dependency Cycle Analysis:**\n- **Process 1201** holds Transaction 89102 and waits for Transaction 89104 (held by Process 1204).\n- **Process 1204** holds Transaction 89104 and waits for a row-level lock on tuple `(48,12)` in `payments` (held by Process 1209).\n- **Process 1209** holds the row-level lock and waits for Transaction 89102 (held by Process 1201).\n- Cycle: `1201 -> 1204 -> 1209 -> 1201`. A classic 3-way circular wait.\n\n**2. Deadlock Detection Mechanics:**\n- When a query requests a conflicting lock, it sleeps on a lock queue. If the lock is not granted within `deadlock_timeout` (default 1000ms), PostgreSQL wakes up the deadlock detection worker.\n- The worker executes a cycle-finding algorithm (Tarjan's / DFS) on the directed wait-for graph.\n- Upon detecting a cycle, PostgreSQL chooses one transaction as the \"deadlock victim\", terminates its query with SQLSTATE `40P01`, and rolls back its transaction, allowing the other two transactions to proceed.\n\n**3. Diagnostic Query for Live Contention:**\n```sql\nSELECT \n    blocked_locks.pid     AS blocked_pid,\n    blocked_activity.usename  AS blocked_user,\n    blocking_locks.pid    AS blocking_pid,\n    blocking_activity.usename AS blocking_user,\n    blocked_activity.query    AS blocked_statement,\n    blocking_activity.query   AS blocking_statement\nFROM  pg_catalog.pg_locks         blocked_locks\nJOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid\nJOIN pg_catalog.pg_locks         blocking_locks \n    ON blocking_locks.locktype = blocked_locks.locktype\n    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database\n    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation\n    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page\n    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple\n    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid\n    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid\n    AND blocking_locks.pid != blocked_locks.pid\nJOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid\nWHERE NOT blocked_locks.granted;\n```\n\n**4. Architectural Remediation:**\n- **Strict Global Lock Ordering**: If multiple rows or tables must be updated in a transaction (e.g. `orders` and `inventory`), always acquire locks in the exact same deterministic order across all application endpoints (e.g., sort IDs: `SELECT ... WHERE id IN (10, 20) ORDER BY id FOR UPDATE`).\n- **Client Retry Loops with Jitter**: Exponential backoff and random jitter for any query failing with `40P01`.\n- **Reduce Transaction Scope**: Never perform third-party HTTP API calls or message queue pushes while holding database row locks.",
    "followUp": {
      "question": "Why does reducing `deadlock_timeout` from 1s to 50ms in a high-concurrency database often hurt performance rather than helping?",
      "expectedAnswer": "The deadlock detector requires acquiring exclusive shared-memory locks across the entire PostgreSQL lock table to compute the directed wait-for graph. Running this heavy graph traversal every 50ms across hundreds of concurrent transactions consumes severe CPU and introduces internal spinlock/LWLocks contention, degrading overall server throughput."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Accurately traces 3-process deadlock cycle from log snippet",
      "Explains deadlock_timeout and Tarjan DFS cycle-detection mechanics",
      "Provides correct pg_locks / pg_stat_activity query for live blocking",
      "Proposes deterministic lock ordering and keeping network calls out of transactions"
    ]
  },
  "expectedConcepts": [
    "Circular wait graph analysis (1201 -> 1204 -> 1209 -> 1201)",
    "deadlock_timeout and background cycle detection algorithm",
    "pg_locks and pg_stat_activity join query for diagnosing blocking chains",
    "Strict deterministic lock acquisition ordering (sorting IDs)",
    "Never holding DB locks during external network I/O"
  ]
}
```
