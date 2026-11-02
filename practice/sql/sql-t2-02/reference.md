# Reference: Correlated Subquery with EXISTS

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`WHERE EXISTS (...)` tests whether the correlated subquery returns at least one row. The moment a matching refund is found for `o.customer_id = c.id`, the database short-circuits and emits the customer row, avoiding duplicates that a simple JOIN might introduce.",
    "code": "SELECT c.id, c.name, c.city FROM customers c WHERE EXISTS (SELECT 1 FROM orders o JOIN refunds r ON o.id = r.order_id WHERE o.customer_id = c.id) ORDER BY c.id ASC;",
    "followUp": {
      "question": "Why is SELECT 1 inside an EXISTS subquery standard practice instead of SELECT * or column names?",
      "expectedAnswer": "EXISTS only cares if any row matches; it completely ignores the SELECT list columns. Writing SELECT 1 signals to engineers and the parser that no column values are being fetched, making the intent clear."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Proper EXISTS predicate",
      "Correlated customer_id",
      "Deduplicated customer output"
    ]
  },
  "expectedConcepts": [
    "EXISTS operator",
    "Correlated subquery",
    "Semi-join semantics",
    "Short-circuit evaluation"
  ]
}
```
