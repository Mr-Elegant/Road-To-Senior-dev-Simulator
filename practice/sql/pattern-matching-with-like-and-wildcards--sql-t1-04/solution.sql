-- Find customers with example.com emails
SELECT id, name, email
FROM customers
WHERE email LIKE '%@example.com'
ORDER BY id ASC;