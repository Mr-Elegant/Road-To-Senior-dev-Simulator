-- Find customers with zero orders
SELECT
  c.id,
  c.name,
  c.email
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL
ORDER BY c.id ASC;