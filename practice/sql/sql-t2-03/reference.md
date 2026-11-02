# Reference: Common Table Expressions (CTEs) for Multi-Step Aggregations

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "The CTE `customer_spending` creates a named temporary result set holding total delivered spend per customer. The outer query cleanly joins this with `customers` and filters for spend over $300, avoiding nested subquery clutter.",
    "code": "WITH customer_spending AS (SELECT customer_id, SUM(total_amount) AS total_spent FROM orders WHERE status = 'DELIVERED' GROUP BY customer_id) SELECT c.name, cs.total_spent FROM customer_spending cs JOIN customers c ON cs.customer_id = c.id WHERE cs.total_spent > 300 ORDER BY cs.total_spent DESC;",
    "followUp": {
      "question": "In PostgreSQL 12+, how does the planner handle CTE optimization with the MATERIALIZED vs NOT MATERIALIZED keywords?",
      "expectedAnswer": "Prior to PG12, all CTEs were optimization barriers (always materialized to memory/disk). PostgreSQL 12+ defaults to inlining (NOT MATERIALIZED) single-reference CTEs like subqueries, allowing index pushes. Specifying WITH ... AS MATERIALIZED forces an independent execution barrier."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Proper WITH clause",
      "Filters DELIVERED orders only",
      "Correct spend threshold filter (> 300)"
    ]
  },
  "expectedConcepts": [
    "WITH clause (CTE)",
    "Readability in multi-stage transformations",
    "Aggregation before joining"
  ]
}
```
