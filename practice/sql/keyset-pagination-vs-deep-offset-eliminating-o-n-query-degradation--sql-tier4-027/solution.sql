-- Optimized keyset pagination query (Page 2+ using composite cursor)
-- Cursor from previous page: last_created_at = '2026-01-03', last_id = 3
SELECT 
    id,
    name,
    price,
    created_at
FROM products
WHERE (created_at, id) < ('2026-01-03', 3)
ORDER BY created_at DESC, id DESC
LIMIT 20;