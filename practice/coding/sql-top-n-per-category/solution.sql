-- Find top 2 products per category using DENSE_RANK
SELECT 
  c.name AS category_name,
  p.title AS product_title,
  p.revenue,
  DENSE_RANK() OVER (PARTITION BY p.category_id ORDER BY p.revenue DESC) AS ranking
FROM products p
JOIN categories c ON p.category_id = c.id;