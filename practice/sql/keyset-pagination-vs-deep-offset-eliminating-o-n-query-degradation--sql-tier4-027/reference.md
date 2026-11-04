# Reference: Keyset Pagination vs Deep OFFSET: Eliminating O(N) Query Degradation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Why OFFSET Scales at $O(N)$:**\n- When you run `SELECT * FROM products ORDER BY created_at DESC LIMIT 20 OFFSET 400000;`, PostgreSQL cannot magically jump to row 400,001.\n- The database must scan through all 400,000 rows, sort them in memory or disk, count 400,000 discarded tuples, and only then return the next 20 rows.\n- As page depth increases, latency and CPU consumption grow linearly.\n\n**2. Keyset Pagination (The Seek Method):**\n- Instead of telling the database how many rows to skip, you tell the database the **exact value of the last item seen on the previous page** using a composite row comparison: `WHERE (created_at, id) < (:last_created_at, :last_id)`.\n- With a matching composite index:\n```sql\nCREATE INDEX idx_products_keyset ON products (created_at DESC, id DESC);\n```\n- The B-tree index performs a direct root-to-leaf binary search in $O(\\log N)$ time to locate the exact starting leaf page and immediately reads the next 20 tuples. Execution time is **identical (1ms) for Page 1, Page 10, or Page 100,000**.\n\n**3. Additional Benefits:**\n- Completely immune to \"missing item\" or \"duplicate item\" pagination bugs caused by concurrent inserts or deletes while the user is browsing.",
    "code": "SELECT \n    id,\n    name,\n    price,\n    created_at\nFROM products\nWHERE (created_at, id) < ('2026-01-03', 3)\nORDER BY created_at DESC, id DESC\nLIMIT 20;",
    "followUp": {
      "question": "Why must the composite cursor include a unique tie-breaker column like `id` in addition to `created_at`?",
      "expectedAnswer": "If multiple rows share the exact same `created_at` timestamp (very common in high-volume systems), filtering purely by `created_at < :last_date` would skip all other rows sharing that same timestamp, resulting in missing records. Adding unique `id` to the cursor guarantees a strictly unique total ordering across all tuples."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains why OFFSET requires scanning and discarding prior tuples",
      "Implements composite row comparison (created_at, id) < (...) syntax",
      "Specifies matching composite index (created_at DESC, id DESC)",
      "Explains tie-breaker requirement for non-unique timestamp columns"
    ]
  },
  "expectedConcepts": [
    "OFFSET scanning and discarding N rows in memory/disk",
    "Linear O(N) degradation of deep OFFSET queries",
    "Composite row-value comparison: (created_at, id) < (:last_date, :last_id)",
    "O(log N) B-tree seek followed by O(LIMIT) scan",
    "Composite index matching sort order: (created_at DESC, id DESC)"
  ]
}
```
