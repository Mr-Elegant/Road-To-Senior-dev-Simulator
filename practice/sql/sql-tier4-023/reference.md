# Reference: Heap-Only Tuple (HOT) Optimization Failures and Write Amplification

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. How Heap-Only Tuple (HOT) Works:**\n- Normally, every `UPDATE` creates a new tuple version in the heap table AND inserts a new `(key, ctid)` entry into **every single index on the table**, even if the indexed columns were not modified!\n- **HOT Optimization**: If an UPDATE satisfies two conditions, PostgreSQL avoids touching any index files:\n  1. The new tuple version is placed in the **exact same 8KB heap page** as the old tuple.\n  2. **None of the columns modified by the UPDATE are covered by any index** on the table.\n- Under HOT, the old tuple’s pointer is updated to point directly to the new tuple version within the same 8KB page. Root index pointers continue pointing to the old tuple, and index scans follow the intra-page tuple chain transparently.\n\n**2. Why Indexing `last_seen_at` Disabled HOT:**\n- Because `last_seen_at` was indexed, every update to that column **violates condition 2**.\n- Every update forces PostgreSQL to insert a new entry into the `last_seen_at` index, plus new entries into all other B-tree indexes if intra-page chaining cannot be used.\n- This causes 10x-50x write amplification: a single 50-byte column change writes to 4 different 8KB index pages and generates heavy WAL.\n\n**3. Diagnostic Query:**\n```sql\nSELECT \n    relname,\n    n_tup_upd,\n    n_tup_hot_upd,\n    round((100.0 * n_tup_hot_upd / nullif(n_tup_upd, 0))::numeric, 2) AS hot_update_pct\nFROM pg_stat_user_tables\nWHERE relname = 'users';\n```\n\n**4. Remediation:**\n- Drop the index on `last_seen_at` if not strictly required for queries, or use Redis/memcached to buffer timestamp updates and flush to Postgres in 15-minute batches.\n- Set `WITH (fillfactor = 70)` on the table so pages retain free space for HOT updates.",
    "followUp": {
      "question": "If an UPDATE modifies a column that is part of a Partial Index, but the old and new row values do NOT satisfy the partial index predicate, can the update still be HOT-eligible?",
      "expectedAnswer": "Yes! Starting in PostgreSQL 11, if an index is partial and the updated column is only in that partial index, PostgreSQL allows a HOT update as long as neither the old nor new row version satisfies the partial index predicate (because the index does not need to be updated)."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains the two strict requirements for HOT updates",
      "Details how indexing an updated column destroys HOT eligibility",
      "Explains write amplification across untouched indexes",
      "Provides pg_stat_user_tables diagnostic query and fillfactor remediation"
    ]
  },
  "expectedConcepts": [
    "Heap-Only Tuple (HOT) intra-page tuple forwarding",
    "Condition 1: Free space in same 8KB page (fillfactor)",
    "Condition 2: No modified column belongs to any index",
    "Write amplification across all table indexes when HOT fails",
    "pg_stat_user_tables hot_update_pct metric"
  ]
}
```
