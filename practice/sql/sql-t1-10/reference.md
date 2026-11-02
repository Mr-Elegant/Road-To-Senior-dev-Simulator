# Reference: Filtering Grouped Aggregates with HAVING

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`HAVING COUNT(*) >= 2` filters groups after aggregation. `WHERE` cannot be used here because `WHERE` filters individual rows before grouping occurs.",
    "code": "SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) >= 2 ORDER BY order_count DESC;",
    "followUp": {
      "question": "Explain the exact query execution order between WHERE, GROUP BY, and HAVING.",
      "expectedAnswer": "The database engine executes: 1. FROM/JOIN to assemble source tables -> 2. WHERE to filter individual rows -> 3. GROUP BY to aggregate into buckets -> 4. HAVING to filter aggregated buckets -> 5. SELECT to project columns -> 6. ORDER BY -> 7. LIMIT."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Correct HAVING filter",
      "Excludes customers with only 1 order",
      "Sorted by order count"
    ]
  },
  "expectedConcepts": [
    "HAVING clause",
    "WHERE vs HAVING",
    "Post-aggregation filtering"
  ]
}
```
