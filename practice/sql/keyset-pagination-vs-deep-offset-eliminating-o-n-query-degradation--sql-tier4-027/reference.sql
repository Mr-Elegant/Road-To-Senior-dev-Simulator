SELECT 
    id,
    name,
    price,
    created_at
FROM products
WHERE (created_at, id) < ('2026-01-03', 3)
ORDER BY created_at DESC, id DESC
LIMIT 20;
