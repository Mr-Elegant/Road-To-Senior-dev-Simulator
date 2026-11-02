# Reference: Transactions with BEGIN, COMMIT, and ROLLBACK

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "```sql\nBEGIN;\nUPDATE inventory SET quantity_on_hand = quantity_on_hand - 1 WHERE product_id = 1;\nINSERT INTO orders (id, customer_id, total_amount) VALUES (113, 2, 199.99);\nCOMMIT;\n```\nIf an error occurs (such as a constraint failure or connection loss), the application issues `ROLLBACK;` (or the database automatically aborts the transaction). Any partial updates made since `BEGIN` are undone, leaving the database in its original clean state.",
    "followUp": {
      "question": "In PostgreSQL, what happens if a command fails inside a transaction block?",
      "expectedAnswer": "PostgreSQL marks the entire transaction as aborted. Any subsequent SQL commands in the block return \"ERROR: current transaction is aborted, commands ignored until end of transaction block\", until ROLLBACK (or rollback to savepoint) is issued."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Provides valid transaction SQL syntax",
      "Explains rollback behavior"
    ]
  },
  "expectedConcepts": [
    "BEGIN / START TRANSACTION",
    "COMMIT commits changes atomically",
    "ROLLBACK restores previous state"
  ]
}
```
