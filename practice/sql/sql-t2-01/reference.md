# Reference: Filtering Above-Average Values with Scalar Subqueries

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "The scalar subquery `(SELECT AVG(price) FROM products WHERE is_active = true)` returns a single float value (~$170.82). The outer query evaluates each product against this threshold in the WHERE clause.",
    "code": "SELECT id, name, category, price FROM products WHERE price > (SELECT AVG(price) FROM products WHERE is_active = true) ORDER BY price DESC;",
    "followUp": {
      "question": "How does a scalar subquery differ from a correlated subquery in terms of execution?",
      "expectedAnswer": "A scalar subquery is independent and executed once by the database engine, with its single value cached and reused. A correlated subquery references values from the outer query row-by-row and must be re-evaluated for each candidate row (unless converted by the planner to a join)."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Valid scalar subquery syntax",
      "Filters active items in average",
      "Sorts by price descending"
    ]
  },
  "expectedConcepts": [
    "Scalar subquery",
    "Nested aggregation",
    "Dynamic threshold filtering"
  ]
}
```
