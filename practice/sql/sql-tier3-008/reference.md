# Reference: PostgreSQL Transaction Isolation: Write Skew and Serializable Snapshot Isolation (SSI)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Why Write Skew Occurs in REPEATABLE READ:**\n- In `REPEATABLE READ`, each transaction takes a single snapshot at its first query.\n- Both transactions read total active debt = $60,000 against their snapshot.\n- Transaction A inserts a $30,000 loan on row X. Transaction B inserts a $30,000 loan on row Y.\n- Because they update/insert different rows, neither transaction experiences a row-level lock conflict, and neither modifies a row modified by the other. Both commit successfully.\n- The invariant ($Total \\le 100,000$) is violated because the business rule spans multiple rows that were read but not locked.\n\n**2. Serializable Snapshot Isolation (SSI) in PostgreSQL:**\n- PostgreSQL implements true `SERIALIZABLE` without locking rows using SSI (Michael J. Cahill algorithm).\n- It tracks **SIREAD locks** (predicate locks) in memory on tuples, pages, and relations read during the transaction.\n- SSI monitors for **rw-antidependencies** (where transaction $T_1$ reads data that concurrent transaction $T_2$ overwrites or inserts into).\n- When SSI detects a dangerous structure (a cycle of dependencies $T_1 \\to T_2 \\to T_1$), it aborts one of the transactions with `SQLSTATE 40001: serialization_failure`.\n- Any application using `SERIALIZABLE` **must** implement client-side transaction retry loops.",
    "followUp": {
      "question": "If you do not want to use SERIALIZABLE isolation, how can you prevent write skew in READ COMMITTED mode using explicit locking?",
      "expectedAnswer": "You can serialize the check using an explicit lock: either lock the parent customer record with `SELECT id FROM customers WHERE id = $1 FOR UPDATE;` (which forces subsequent transactions for that customer to wait until the first commits), or acquire an advisory lock on the customer ID: `SELECT pg_advisory_xact_lock($1);`."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 20,
    "criteria": [
      "Defines Write Skew and explains why Repeatable Read fails to prevent it",
      "Explains SSI mechanics and non-blocking SIREAD predicate locks",
      "Identifies rw-antidependency cycles as the abort trigger",
      "Highlights application retry requirement for SQLSTATE 40001"
    ]
  },
  "expectedConcepts": [
    "Write Skew anomaly definition on overlapping disjoint rows",
    "Why Repeatable Read only protects against single-row concurrent updates",
    "SSI (Serializable Snapshot Isolation) and non-blocking SIREAD locks",
    "rw-antidependency tracking and dependency cycle detection",
    "SQLSTATE 40001 serialization_failure and retry logic"
  ]
}
```
