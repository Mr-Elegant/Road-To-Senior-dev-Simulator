SELECT category, COUNT(*) AS product_count, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category ORDER BY product_count DESC;
