-- Find active products with price > 100
SELECT
  sku,
  name,
  price
FROM products
WHERE is_active = true AND price > 100
ORDER BY price DESC;