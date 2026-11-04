WITH RECURSIVE category_tree AS (
    -- Anchor member
    SELECT 
        id, 
        parent_id, 
        name,
        1 AS depth,
        name AS breadcrumb
    FROM categories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive member
    SELECT 
        c.id, 
        c.parent_id, 
        c.name,
        ct.depth + 1,
        ct.breadcrumb || ' > ' || c.name
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT id, name, depth, breadcrumb
FROM category_tree
ORDER BY breadcrumb;