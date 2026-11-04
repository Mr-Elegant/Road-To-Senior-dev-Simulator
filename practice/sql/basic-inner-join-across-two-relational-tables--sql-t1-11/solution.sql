-- Inner join orders and customers
SELECT
  o.id AS order_id,
  c.name AS customer_name,
  o.order_date,
  o.total_amount
FROM orders o
JOIN customers c ON o.customer_id = c.id
ORDER BY o.id ASC;