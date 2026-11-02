# Reference: Row-Level Locking with SELECT FOR UPDATE

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "The Check-Then-Act anomaly occurs when two transactions read the same initial state concurrently. Since neither holds a lock, both read $100 and both pass the balance check. To prevent this, Transaction 1 executes:\n```sql\nSELECT balance FROM accounts WHERE id = 1 FOR UPDATE;\n```\n`FOR UPDATE` places an Exclusive Row-Level Lock (`RowExclusiveLock` / `XMAX` marking). When Transaction 2 attempts `SELECT ... FOR UPDATE` on row 1, it blocks until Transaction 1 commits or rolls back. Once unblocked, Transaction 2 re-reads the updated balance ($20), fails the balance check, and aborts safely.",
    "followUp": {
      "question": "What does SELECT ... FOR UPDATE SKIP LOCKED do, and why is it used in high-throughput task queues?",
      "expectedAnswer": "SKIP LOCKED instructs PostgreSQL to bypass any rows currently locked by concurrent transactions and return the next unlocked rows immediately. This allows multiple background workers to consume jobs from a queue table concurrently without blocking each other."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains check-then-act anomaly",
      "Shows SELECT FOR UPDATE syntax",
      "Explains blocking and commit release"
    ]
  },
  "expectedConcepts": [
    "Check-then-act race condition",
    "Pessimistic locking with FOR UPDATE",
    "Lock contention and blocking until commit",
    "Preventing negative balance overselling"
  ]
}
```
