-- Multi-step aggregation using CTE
WITH customer_spending AS (
  SELECT
    customer_id,
    SUM(total_amount) AS total_spent
  FROM orders
  WHERE status = 'DELIVERED'
  GROUP BY customer_id
)
SELECT
  c.name,
  cs.total_spent
FROM customer_spending cs
JOIN customers c ON cs.customer_id = c.id
WHERE cs.total_spent > 300
ORDER BY cs.total_spent DESC;