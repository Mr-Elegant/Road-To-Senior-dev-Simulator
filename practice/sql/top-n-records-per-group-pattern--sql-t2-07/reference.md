# Reference: Top N Records Per Group Pattern

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Window functions cannot be placed directly in a WHERE clause because they evaluate after WHERE filtering. Wrapping in a CTE allows the outer query to filter `WHERE rn = 1`, solving the classic Top-N-per-group challenge.",
    "code": "WITH ranked_products AS (SELECT category, name, price, ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn FROM products) SELECT category, name, price FROM ranked_products WHERE rn = 1 ORDER BY category ASC;",
    "followUp": {
      "question": "In PostgreSQL 13+, how does the planner optimize queries with QUALIFY in other dialects vs CTEs in PostgreSQL?",
      "expectedAnswer": "Dialects like Snowflake and Teradata support a QUALIFY clause to filter window results without a subquery. PostgreSQL does not yet have a QUALIFY keyword, making the CTE / subquery approach standard."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Proper CTE and ROW_NUMBER",
      "Filters exactly rn = 1",
      "Returns exactly one product per category"
    ]
  },
  "expectedConcepts": [
    "Top-N per group pattern",
    "ROW_NUMBER() window partitioning",
    "CTE wrapping to filter window output"
  ]
}
```
