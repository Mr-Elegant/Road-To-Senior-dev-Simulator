-- Top 1 most expensive product per category
WITH ranked_products AS (
  SELECT
    category,
    name,
    price,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn
  FROM products
)
SELECT
  category,
  name,
  price
FROM ranked_products
WHERE rn = 1
ORDER BY category ASC;