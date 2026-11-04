# Reference: Grouping and Aggregating with GROUP BY

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`GROUP BY category` collapses rows sharing the same category into summary groups, allowing `COUNT(*)` and `AVG(price)` to be computed per category.",
    "code": "SELECT category, COUNT(*) AS product_count, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category ORDER BY product_count DESC;",
    "followUp": {
      "question": "Why will a query fail if you include an unaggregated column in SELECT that is not listed in GROUP BY?",
      "expectedAnswer": "Relational semantics require each output cell to have a deterministic single value. If a group contains multiple rows with different values for an unaggregated column, the database cannot decide which value to display without an explicit aggregate."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Valid GROUP BY structure",
      "Accurate per-category counts",
      "Sorted by count descending"
    ]
  },
  "expectedConcepts": [
    "GROUP BY clause",
    "Aggregate per group",
    "ORDER BY aggregate alias"
  ]
}
```
