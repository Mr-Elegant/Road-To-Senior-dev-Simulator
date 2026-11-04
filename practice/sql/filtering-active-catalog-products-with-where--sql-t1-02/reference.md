# Reference: Filtering Active Catalog Products with WHERE

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Combines boolean condition `is_active = true` and numerical comparison `price > 100` using the logical `AND` operator, sorting by `price DESC` to surface premium items first.",
    "code": "SELECT sku, name, price FROM products WHERE is_active = true AND price > 100 ORDER BY price DESC;",
    "followUp": {
      "question": "How does SQL handle NULL values when evaluating a WHERE condition like price > 100?",
      "expectedAnswer": "SQL uses three-valued logic (TRUE, FALSE, UNKNOWN). If price is NULL, price > 100 evaluates to UNKNOWN. The WHERE clause only accepts rows evaluating strictly to TRUE, so rows with NULL price are excluded."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Correctly filters active items only",
      "Excludes items with price <= 100",
      "Orders results by price descending"
    ]
  },
  "expectedConcepts": [
    "WHERE clause",
    "Logical AND",
    "Comparison operators",
    "ORDER BY DESC"
  ]
}
```
