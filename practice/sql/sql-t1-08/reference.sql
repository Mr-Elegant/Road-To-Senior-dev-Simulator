SELECT COUNT(*) AS total_orders, SUM(total_amount) AS gross_revenue, ROUND(AVG(total_amount), 2) AS avg_order_value FROM orders WHERE status = 'DELIVERED';
