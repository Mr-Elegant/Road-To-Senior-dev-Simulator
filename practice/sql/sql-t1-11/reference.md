# Reference: Basic INNER JOIN Across Two Relational Tables

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`JOIN customers c ON o.customer_id = c.id` performs an INNER JOIN connecting primary key `customers.id` with foreign key `orders.customer_id`. Only matching pairs are included.",
    "code": "SELECT o.id AS order_id, c.name AS customer_name, o.order_date, o.total_amount FROM orders o JOIN customers c ON o.customer_id = c.id ORDER BY o.id ASC;",
    "followUp": {
      "question": "What happens in an INNER JOIN if an order has a customer_id that does not exist in the customers table?",
      "expectedAnswer": "In an INNER JOIN, the row is discarded because the ON predicate evaluates to false or unknown. To preserve orders with unlinked or NULL customer IDs, a LEFT JOIN is required."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Proper INNER JOIN condition",
      "Aliases mapped cleanly",
      "Orders matches ascending by id"
    ]
  },
  "expectedConcepts": [
    "INNER JOIN",
    "Table aliases (o, c)",
    "ON join predicate",
    "Primary/Foreign key matching"
  ]
}
```
