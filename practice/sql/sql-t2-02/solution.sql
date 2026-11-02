-- Customers with at least one refund using EXISTS
SELECT
  c.id,
  c.name,
  c.city
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  JOIN refunds r ON o.id = r.order_id
  WHERE o.customer_id = c.id
)
ORDER BY c.id ASC;