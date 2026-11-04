SELECT 
    id,
    name,
    tags,
    cardinality(tags) AS total_tags
FROM products
WHERE tags @> ARRAY['wireless', 'audio']
ORDER BY id;
