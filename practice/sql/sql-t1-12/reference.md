# Reference: Finding Inactive Records with LEFT JOIN and IS NULL

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`LEFT JOIN` preserves all rows from the left table (`customers`). When a customer has no matching row in `orders`, the order columns populate with `NULL`. Filtering by `WHERE o.id IS NULL` isolates customers with no orders (Anti-Join pattern).",
    "code": "SELECT c.id, c.name, c.email FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL ORDER BY c.id ASC;",
    "followUp": {
      "question": "How does an anti-join with LEFT JOIN ... IS NULL compare with NOT EXISTS in PostgreSQL?",
      "expectedAnswer": "Modern query planners often optimize both into identical Hash Anti-Join plans. However, NOT EXISTS is generally preferred for readability and avoids unintended column evaluation."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Correct LEFT JOIN structure",
      "Filters with o.id IS NULL",
      "Returns empty array if all ordered"
    ]
  },
  "expectedConcepts": [
    "LEFT OUTER JOIN",
    "Anti-Join pattern",
    "NULL checking on foreign table"
  ]
}
```
