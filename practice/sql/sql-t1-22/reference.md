# Reference: ACID Properties in Relational Databases

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "ACID guarantees database reliability: 1. Atomicity: All operations in a transaction succeed or all roll back (\"all-or-nothing\"). The transfer rollback prevents money from disappearing. 2. Consistency: Transactions transition the database from one valid state to another, respecting all constraints (e.g. non-negative balance). 3. Isolation: Concurrent transactions execute without interfering with one another. 4. Durability: Once committed, changes survive crashes or power failures (persisted to Write-Ahead Log / disk).",
    "followUp": {
      "question": "Which PostgreSQL mechanism guarantees Durability before dirty buffers are written to data files?",
      "expectedAnswer": "The Write-Ahead Log (WAL). PostgreSQL writes transaction changes sequentially to the WAL and flushes it to disk (fsync) before reporting success to the client."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Accurately defines all 4 letters",
      "Applies directly to bank transfer failure scenario"
    ]
  },
  "expectedConcepts": [
    "Atomicity (All or nothing)",
    "Consistency (Constraints preserved)",
    "Isolation (Concurrency control)",
    "Durability (Persistence via WAL)"
  ]
}
```
