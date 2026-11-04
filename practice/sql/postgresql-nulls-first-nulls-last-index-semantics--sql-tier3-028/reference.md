# Reference: PostgreSQL NULLS FIRST / NULLS LAST Index Semantics

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Default B-Tree NULL Ordering:**\n- In SQL standard and PostgreSQL, B-tree indexes are sorted ascending by default: `ASC NULLS LAST` (NULLs are treated as larger than any value, placed at the end).\n- For descending indexes (`DESC`), the default is `DESC NULLS FIRST` (NULLs appear at the very beginning of the index scan).\n\n**2. Why the Index Failed:**\n- The index was created as `CREATE INDEX idx_orders_shipped ON orders(shipped_at DESC);`.\n- Because of defaults, this index physically stores entries as `DESC NULLS FIRST`.\n- The query requested `ORDER BY shipped_at DESC NULLS LAST`.\n- Because the physical order of NULLs in the index does not match the requested query sort order, PostgreSQL cannot read the index in order. It must perform an expensive in-memory or disk sort (`Sort Method: external merge Disk`).\n\n**3. Exact Matching Index Solution:**\n```sql\nCREATE INDEX idx_orders_shipped_desc_nulls_last \nON orders (shipped_at DESC NULLS LAST);\n```\nWith this index, PostgreSQL reads the leaf pages directly via an Index Scan with zero CPU sorting.",
    "followUp": {
      "question": "Can PostgreSQL scan an `ASC NULLS LAST` index backwards (backward index scan) to satisfy an `ORDER BY col DESC NULLS LAST` query?",
      "expectedAnswer": "No. Scanning an `ASC NULLS LAST` index backwards yields `DESC NULLS FIRST`. Because the NULLs are physically at the end of the ASC index, reading it backwards encounters the NULLs first. Therefore, a backward scan cannot satisfy `DESC NULLS LAST` without an explicit sort step."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains default NULL ordering (ASC NULLS LAST, DESC NULLS FIRST)",
      "Identifies mismatch between index (NULLS FIRST) and query (NULLS LAST)",
      "Explains why backward index scans fail to resolve this mismatch",
      "Provides exact DDL: CREATE INDEX ... (col DESC NULLS LAST)"
    ]
  },
  "expectedConcepts": [
    "B-Tree physical sort ordering and NULL placement",
    "Default rules: ASC defaults to NULLS LAST; DESC defaults to NULLS FIRST",
    "Sort elimination requirement: index ordering must match query ORDER BY exactly",
    "CREATE INDEX ... DESC NULLS LAST syntax"
  ]
}
```
