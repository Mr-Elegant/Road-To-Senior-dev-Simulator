-- Calculate cumulative running revenue
SELECT
  id,
  order_date,
  total_amount,
  SUM(total_amount) OVER (ORDER BY order_date ASC) AS running_total
FROM orders
WHERE status = 'DELIVERED'
ORDER BY order_date ASC;