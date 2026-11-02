# Reference: Multi-Table Join: Order Items with Products and Customers

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Chains multiple `JOIN` clauses along foreign key paths: `customers` -> `orders` -> `order_items` -> `products`, filtered by `c.name = 'Aarav Patel'`.",
    "code": "SELECT o.id AS order_id, p.name AS product_name, oi.quantity, oi.unit_price FROM orders o JOIN customers c ON o.customer_id = c.id JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id WHERE c.name = 'Aarav Patel' ORDER BY o.id ASC, p.name ASC;",
    "followUp": {
      "question": "What is a Cartesian Product (Cross Join) and how does it happen accidentally in multi-table queries?",
      "expectedAnswer": "A Cartesian product occurs when tables are combined without an ON join condition (or with comma syntax without a WHERE filter). The database multiplies every row in table A by every row in table B (N × M), causing severe performance degradation."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Proper 4-table join chain",
      "Filters specifically for Aarav Patel",
      "Accurate line-item details"
    ]
  },
  "expectedConcepts": [
    "Chained relational joins",
    "Entity-relationship traversal",
    "Foreign key paths"
  ]
}
```
