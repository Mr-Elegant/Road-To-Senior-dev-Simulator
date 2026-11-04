# Reference: Range Filtering with BETWEEN and Date Comparison

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Filtering timestamp ranges is best done using half-open intervals: `>= '2024-02-01'` and `< '2024-03-01'`. This cleanly captures all timestamp entries up to 23:59:59.999 without precision loss.",
    "code": "SELECT id, customer_id, order_date, total_amount FROM orders WHERE order_date >= '2024-02-01' AND order_date < '2024-03-01' ORDER BY order_date ASC;",
    "followUp": {
      "question": "Why is using BETWEEN with datetime values considered an anti-pattern in production queries?",
      "expectedAnswer": "BETWEEN is inclusive on both ends. If the boundary is '2024-02-28', it defaults to '2024-02-28 00:00:00', excluding orders placed later that day. If using '2024-02-28 23:59:59', records with sub-second precision (e.g. 23:59:59.500) can be missed."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Correct February bounds",
      "Chronological order"
    ]
  },
  "expectedConcepts": [
    "Date filtering",
    "Half-open intervals",
    "Logical comparison"
  ]
}
```
