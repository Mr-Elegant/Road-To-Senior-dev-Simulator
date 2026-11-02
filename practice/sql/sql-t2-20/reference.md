# Reference: PostgreSQL Read Committed vs. Repeatable Read Isolation Levels

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Under `Read Committed` (PostgreSQL default), each SQL statement inside a transaction sees a fresh snapshot of all data committed before THAT statement began. If a concurrent transaction commits changes between query 1 and query 2, query 2 sees the new data (Non-Repeatable Read). Under `Repeatable Read`, PostgreSQL captures a single transaction snapshot when the FIRST statement in the transaction executes. All subsequent queries throughout the transaction see that exact same snapshot, guaranteeing consistent reads regardless of concurrent commits.",
    "followUp": {
      "question": "What happens in Repeatable Read if transaction T1 tries to UPDATE a row that was updated and committed by transaction T2 after T1's snapshot was taken?",
      "expectedAnswer": "PostgreSQL raises a serialization failure: \"ERROR: could not serialize access due to concurrent update\". Transaction T1 must abort and retry from the beginning."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Differentiates statement snapshot from transaction snapshot",
      "Defines non-repeatable read",
      "Explains snapshot isolation"
    ]
  },
  "expectedConcepts": [
    "Read Committed statement-level snapshot",
    "Repeatable Read transaction-level snapshot",
    "Non-repeatable read anomaly definition",
    "MVCC snapshot isolation"
  ]
}
```
