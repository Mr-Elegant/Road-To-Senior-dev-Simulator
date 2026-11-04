# Reference: Advisory Locks vs FOR UPDATE SKIP LOCKED for Message Queues

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Comparison of Locking Modifiers:**\n- `FOR UPDATE`: Acquires row-level exclusive locks. If another transaction holds a lock on a row, the current query **blocks and waits** until the other transaction commits or aborts.\n- `FOR UPDATE NOWAIT`: Attempts to lock the rows; if any matching row is already locked by another transaction, it **immediately aborts** with an error: `55P03 lock_not_available`.\n- `FOR UPDATE SKIP LOCKED`: Inspects candidate rows. If a row is already locked by any concurrent transaction, it **silently skips that row** and continues down the index to lock the next available unlocked rows up to the `LIMIT`.\n\n**2. Atomic Worker Claim Query:**\n```sql\nWITH claimed_jobs AS (\n    SELECT id\n    FROM outbox_events\n    WHERE status = 'PENDING'\n    ORDER BY id ASC\n    LIMIT 5\n    FOR UPDATE SKIP LOCKED\n)\nUPDATE outbox_events\nSET \n    status = 'PROCESSING',\n    processed_at = CURRENT_TIMESTAMP\nFROM claimed_jobs\nWHERE outbox_events.id = claimed_jobs.id\nRETURNING outbox_events.id, outbox_events.payload, outbox_events.status;\n```\nThis enables perfectly parallel, non-blocking queue workers with zero lock contention.",
    "code": "WITH claimed_jobs AS (\n    SELECT id\n    FROM outbox_events\n    WHERE status = 'PENDING'\n    ORDER BY id ASC\n    LIMIT 5\n    FOR UPDATE SKIP LOCKED\n)\nUPDATE outbox_events\nSET \n    status = 'PROCESSING',\n    processed_at = CURRENT_TIMESTAMP\nFROM claimed_jobs\nWHERE outbox_events.id = claimed_jobs.id\nRETURNING outbox_events.id, outbox_events.payload, outbox_events.status;",
    "followUp": {
      "question": "Why is an index on `(status, id)` essential for `SKIP LOCKED` worker queries on tables with millions of completed rows?",
      "expectedAnswer": "Without an index on `(status, id)`, PostgreSQL must perform a sequential scan of the table to find `status = 'PENDING'` rows. While scanning, it must check row lock status on every examined row, creating massive lock manager overhead and scanning millions of historical processed rows."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 15,
    "criteria": [
      "Differentiates FOR UPDATE, NOWAIT, and SKIP LOCKED clearly",
      "Implements CTE with SELECT ... FOR UPDATE SKIP LOCKED and UPDATE",
      "Explains why workers achieve lock-free parallelism",
      "Identifies indexing requirement on queue status column"
    ]
  },
  "expectedConcepts": [
    "FOR UPDATE blocking behavior vs NOWAIT failure",
    "SKIP LOCKED silently bypassing locked rows for parallel worker queues",
    "CTE pairing SELECT ... FOR UPDATE SKIP LOCKED with UPDATE ... RETURNING",
    "Index requirement on (status, id) to avoid sequential scan locking"
  ]
}
```
