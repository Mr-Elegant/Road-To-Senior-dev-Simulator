# Reference: Top 2 Revenue Products Per Category (Window Functions)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "code": "SELECT \n  category_name,\n  product_title,\n  revenue,\n  ranking\nFROM (\n  SELECT \n    c.name AS category_name,\n    p.title AS product_title,\n    p.revenue,\n    DENSE_RANK() OVER (PARTITION BY p.category_id ORDER BY p.revenue DESC) AS ranking\n  FROM products p\n  JOIN categories c ON p.category_id = c.id\n) ranked\nWHERE ranking <= 2\nORDER BY category_name ASC, ranking ASC, revenue DESC;",
    "explanation": "Uses a subquery to compute the window function DENSE_RANK partitioned by category, then filters ranking <= 2 in the outer query.",
    "timeComplexity": "O(N log N) partitioned window sort"
  }
}
```
