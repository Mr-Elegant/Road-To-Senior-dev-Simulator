SELECT category, name, price, DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC) AS category_price_rank FROM products ORDER BY category ASC, category_price_rank ASC;
