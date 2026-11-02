-- Customers with 2 or more orders
SELECT
  customer_id,
  COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 2
ORDER BY order_count DESC;