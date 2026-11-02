SELECT id, name, category, price FROM products WHERE price > (SELECT AVG(price) FROM products WHERE is_active = true) ORDER BY price DESC;
