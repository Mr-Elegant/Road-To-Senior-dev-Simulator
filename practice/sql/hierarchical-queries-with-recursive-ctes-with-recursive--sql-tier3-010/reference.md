# Reference: Hierarchical Queries with Recursive CTEs (WITH RECURSIVE)

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Recursive CTEs in SQL consist of two parts united by `UNION ALL` (or `UNION`):\n\n1. **Anchor Member**: The base query executed once to initialize the intermediate working table (e.g. root nodes where `parent_id IS NULL`).\n2. **Recursive Member**: The query that references the CTE itself, executing iteratively on the rows returned by the previous iteration until it returns an empty result set.\n\n```sql\nWITH RECURSIVE category_tree AS (\n    -- Anchor: top-level roots\n    SELECT \n        id, parent_id, name,\n        1 AS depth,\n        CAST(name AS VARCHAR(1000)) AS breadcrumb\n    FROM categories\n    WHERE parent_id IS NULL\n    \n    UNION ALL\n    \n    -- Recursive: children join to current working table\n    SELECT \n        c.id, c.parent_id, c.name,\n        ct.depth + 1,\n        CAST(ct.breadcrumb || ' > ' || c.name AS VARCHAR(1000))\n    FROM categories c\n    JOIN category_tree ct ON c.parent_id = ct.id\n)\nSELECT id, name, depth, breadcrumb\nFROM category_tree\nORDER BY breadcrumb;\n```",
    "code": "WITH RECURSIVE category_tree AS (\n    SELECT \n        id, \n        parent_id, \n        name,\n        1 AS depth,\n        name::text AS breadcrumb\n    FROM categories\n    WHERE parent_id IS NULL\n    \n    UNION ALL\n    \n    SELECT \n        c.id, \n        c.parent_id, \n        c.name,\n        ct.depth + 1,\n        ct.breadcrumb || ' > ' || c.name\n    FROM categories c\n    JOIN category_tree ct ON c.parent_id = ct.id\n)\nSELECT id, name, depth, breadcrumb\nFROM category_tree\nORDER BY breadcrumb;",
    "followUp": {
      "question": "How do you prevent infinite recursion in a recursive CTE if the data contains a cyclic graph (e.g., node A is parent of B, B is parent of A)?",
      "expectedAnswer": "In PostgreSQL 14+, you can use the `CYCLE` clause: `CYCLE id SET is_cycle USING path`. In older versions, accumulate visited IDs in an array (`ARRAY[id]`) and add a termination guard in the recursive member: `WHERE NOT (c.id = ANY(ct.visited_ids))`."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 15,
    "criteria": [
      "Correctly structures anchor query with parent_id IS NULL",
      "Correctly structures recursive member with parent-child join",
      "Accurately computes depth and breadcrumb path string",
      "Explains cycle prevention techniques"
    ]
  },
  "expectedConcepts": [
    "Anchor query selecting base root records",
    "Recursive query joining child records to working CTE table",
    "Termination condition when recursive join returns 0 rows",
    "Depth counting and string path accumulation"
  ]
}
```
