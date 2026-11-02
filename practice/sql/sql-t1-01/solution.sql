-- Select name, category, and price for the first 5 products
SELECT
  name,
  category,
  price
FROM products
ORDER BY name ASC
LIMIT 5;