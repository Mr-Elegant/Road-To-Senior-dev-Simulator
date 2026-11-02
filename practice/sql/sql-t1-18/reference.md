# Reference: Second Normal Form (2NF) and Composite Keys

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Second Normal Form (2NF) requires a table to be in 1NF and have no partial dependencies: every non-key column must depend on the WHOLE primary key, not just a part of it. In `order_items (order_id, product_id, quantity, product_name)`, `product_name` depends only on `product_id`, not on `order_id`. Storing it here introduces update anomalies: if a product is renamed, every past order item must be updated. The solution is normalizing product metadata into a separate `products` table.",
    "followUp": {
      "question": "Why do data warehouses deliberately violate 2NF and 3NF through denormalization?",
      "expectedAnswer": "Data warehouses use star/snowflake schemas with denormalized dimensional tables to eliminate expensive multi-table joins during analytical aggregation queries, trading storage redundancy for read speed."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Defines 2NF",
      "Explains partial dependency",
      "Identifies anomalies"
    ]
  },
  "expectedConcepts": [
    "Must be in 1NF",
    "No partial dependencies",
    "Non-key attributes must depend on the whole composite primary key",
    "Update and deletion anomalies"
  ]
}
```
