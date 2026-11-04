# Reference: Database Deadlocks: Causes and Prevention

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A Deadlock occurs when two or more transactions hold locks that the other needs, creating a circular wait condition:\n- T1 locks Account A and waits for Account B.\n- T2 locks Account B and waits for Account A.\nNeither transaction can proceed. PostgreSQL runs a background deadlock detector (triggered after `deadlock_timeout`, default 1s). It analyzes the lock dependency graph, detects the cycle, and forcibly aborts one transaction with `ERROR: deadlock detected` so the other can finish.\nGolden Prevention Rule: Always acquire locks in a globally consistent order (e.g. sort account IDs ascending in application code: lock `LEAST(acc_a, acc_b)` first, then `GREATEST(acc_a, acc_b)`).",
    "followUp": {
      "question": "How should an application handle a deadlock error when it receives one from the database?",
      "expectedAnswer": "The application must catch the 40P01 deadlock exception, roll back the failed transaction, wait for a short randomized jitter delay, and automatically retry the transaction from the beginning."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains circular wait",
      "Explains PostgreSQL deadlock_timeout detection",
      "Provides canonical ordering solution"
    ]
  },
  "expectedConcepts": [
    "Circular lock dependency",
    "deadlock_timeout and dependency cycle detection",
    "Automatic transaction abort and rollback",
    "Consistent resource locking order (canonical ordering)"
  ]
}
```
