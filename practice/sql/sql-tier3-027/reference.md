# Reference: Array Data Types and High-Performance Containment Queries

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. PostgreSQL Array Operators:**\n- `@>` (Contains): Checks if the left array contains all elements of the right array.\n- `<@` (Is Contained By): Checks if left array elements are a subset of the right array.\n- `&&` (Overlap): Checks if arrays share at least one common element.\n- `cardinality(arr)`: Returns the total number of elements in the array (or 0 if empty).\n- `unnest(arr)`: Expands an array into a relational set of rows.\n\n**2. GIN Indexing for Arrays:**\nA B-tree index on an array column only supports whole-array equality (`tags = ARRAY[...]`). To accelerate containment (`@>`) and overlap (`&&`), a GIN index must be used:\n```sql\nCREATE INDEX idx_products_tags_gin ON products USING gin (tags);\n```\nGIN decomposes each distinct tag into an inverted index entry, allowing instant lookups regardless of tag position in the array.\n\n**3. Executable Query:**\n```sql\nSELECT \n    id, name, tags,\n    cardinality(tags) AS total_tags\nFROM products\nWHERE tags @> ARRAY['wireless', 'audio']\nORDER BY id;\n```",
    "code": "SELECT \n    id,\n    name,\n    tags,\n    cardinality(tags) AS total_tags\nFROM products\nWHERE tags @> ARRAY['wireless', 'audio']\nORDER BY id;",
    "followUp": {
      "question": "When is storing data in an array column an anti-pattern compared to a standard normalized junction table (`product_tags`)?",
      "expectedAnswer": "Storing in an array is an anti-pattern when: (1) You need foreign key constraints to ensure tags exist in a master `tags` table (Postgres cannot enforce FKs on array elements); (2) You need to associate attributes with the relationship (e.g. `added_by`, `assigned_at`); or (3) Tags are frequently updated independently by concurrent transactions (modifying an array requires updating the entire parent row, causing tuple bloat)."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 15,
    "criteria": [
      "Uses @> containment operator accurately",
      "Uses cardinality() function for element counting",
      "Explains GIN inverted indexing for array columns",
      "Identifies trade-offs between array columns and normalized junction tables"
    ]
  },
  "expectedConcepts": [
    "Array containment (@>) vs overlap (&&) operators",
    "cardinality() function for element count",
    "GIN inverted index requirement for array elements",
    "Difference between whole-array B-tree equality and GIN element search"
  ]
}
```
