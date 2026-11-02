# Reference: PostgreSQL Foreign Keys with ON DELETE CASCADE: Lock Cascade Hazards

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. How ON DELETE CASCADE Locks Data:**\n- When `DELETE FROM users WHERE id = 101` executes, PostgreSQL fires internal foreign key triggers to delete all referencing child rows across all dependent tables.\n- In a 6-level hierarchy, PostgreSQL must acquire row-level exclusive locks on every descendant row across all 8 tables within a **single transaction**.\n- All these locks are held simultaneously from the beginning of the cascade until the transaction **commits**.\n- As the cascade traverses hundreds of thousands of rows, concurrent user transactions attempting to like a post, add a comment, or update a profile intersect with the lock footprint, resulting in massive blocking queues and deadlocks.\n\n**2. The Danger of Lack of Pagination:**\n- A database cascade cannot be paginated or throttled. It must complete all 250,000 row deletions atomically. This creates massive WAL bursts, replication lag, and high latency.\n\n**3. Production Alternatives:**\n- **Pattern A: Soft Deletes with Immediate User Invalidation**:\n  - Set `UPDATE users SET deleted_at = NOW(), status = 'DELETED' WHERE id = 101;`.\n  - The transaction finishes in 1ms. The user is logged out immediately and hidden from search.\n- **Pattern B: Asynchronous Background Deletion Queue**:\n  - A background worker reads deleted user IDs and deletes dependent rows from the bottom of the hierarchy up (reactions $\\to$ comments $\\to$ posts $\\to$ user) in **small batches of 500 rows** with explicit sleep throttles between transactions.\n  - This spreads disk I/O over minutes without holding long locks or causing deadlocks.",
    "followUp": {
      "question": "Why does a foreign key defined with `ON DELETE SET NULL` carry similar locking risks to `ON DELETE CASCADE`?",
      "expectedAnswer": "`ON DELETE SET NULL` must execute an `UPDATE` on every child row to set the foreign key column to NULL. Just like `CASCADE`, this requires acquiring exclusive row locks on all child rows and updating any indexes on that column within the same transaction, creating identical lock contention and bloat risks."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains single-transaction lock accumulation across child relations",
      "Details deadlock vulnerability with concurrent user operations",
      "Highlights lack of throttling in native SQL cascades",
      "Proposes soft deletes paired with chunked background deletion workers"
    ]
  },
  "expectedConcepts": [
    "Single-transaction lock accumulation across entire relation hierarchy",
    "All row locks held until COMMIT",
    "Deadlocks with concurrent writes to descendant tables",
    "Lack of throttling/batching in native database cascades",
    "Soft delete + asynchronous chunked background deletion worker"
  ]
}
```
