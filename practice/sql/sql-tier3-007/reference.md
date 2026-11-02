# Reference: PostgreSQL JSONB: Operators, jsonb_path_query, and GIN Indexing

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. JSON vs JSONB:**\n- `JSON` stores exact plain text (preserves whitespace, key order, duplicate keys). Parsing is deferred to query time on every read.\n- `JSONB` stores decomposed binary format. Removes whitespace, deduplicates keys, sorts keys for binary search. Slightly slower on write, but orders of magnitude faster on read and supports indexing.\n\n**2. Core JSONB Operators:**\n- `->`: Extracts JSON element by key or array index as `JSONB`.\n- `->>`: Extracts JSON element as scalar `TEXT`.\n- `@>`: Containment operator (checks if left JSONB contains right JSONB). Returns BOOLEAN.\n- `?`: Checks if string exists as top-level key in JSONB.\n- `@@` / `@?`: SQL/JSON path evaluation operators (PG 12+).\n\n**3. SQL/JSON Path Query:**\nTo find products where RAM is >= 16:\n```sql\nSELECT id, name, specifications\nFROM products\nWHERE specifications @@ '$.ram_gb >= 16 && ($.color == \"space_gray\" || $.color == \"silver\")';\n```\n\n**4. Indexing Strategy:**\n```sql\n-- For exact containment (@>) and path queries:\nCREATE INDEX idx_products_specs_gin ON products USING gin (specifications jsonb_path_ops);\n\n-- For numeric comparison inside JSONB, an expression B-tree index is best:\nCREATE INDEX idx_products_ram ON products (((specifications->>'ram_gb')::numeric));\n```",
    "followUp": {
      "question": "Why does `CREATE INDEX ON products USING gin ((specifications->>'brand'))` fail, and what should be used instead?",
      "expectedAnswer": "`specifications->>'brand'` returns a `TEXT` scalar. GIN indexes only support composite or multi-value types (JSONB, arrays, tsvector). To index a scalar text extraction from JSON, you must create a standard B-Tree expression index: `CREATE INDEX idx_brand ON products ((specifications->>'brand'));`"
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains binary decomposition and indexing differences between JSON and JSONB",
      "Accurately defines ->, ->>, @>, and jsonb path syntax",
      "Recognizes that scalar range queries require expression B-tree indexes",
      "Distinguishes GIN containment from B-tree scalar indexing"
    ]
  },
  "expectedConcepts": [
    "JSON (text) vs JSONB (decomposed binary) storage format",
    "Difference between -> (jsonb) and ->> (text)",
    "Containment operator @> and existence operator ?",
    "SQL/JSON path expression syntax (@@)",
    "Expression B-tree index vs GIN jsonb_path_ops index"
  ]
}
```
