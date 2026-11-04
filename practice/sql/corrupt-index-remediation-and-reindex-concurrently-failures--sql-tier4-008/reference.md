# Reference: Corrupt Index Remediation and REINDEX CONCURRENTLY Failures

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. B-Tree Index Corruption Symptoms:**\n- When an index page is corrupted (due to hardware disk corruption, OS caching bugs, or RAM bit-flips), the B-tree routing keys can point to incorrect child pages. An index scan follows the incorrect branch, concludes the key does not exist, and returns 0 rows, while a sequential scan reads the physical heap and finds the row.\n\n**2. The REINDEX CONCURRENTLY Interrupted State:**\n- When `REINDEX CONCURRENTLY` runs, PostgreSQL creates a new shadow index named `<indexname>_ccnew`.\n- It builds the new index in two passes while live writes update both the old and new indexes.\n- If interrupted midway (e.g. timeout or connection drop), the operation leaves `<indexname>_ccnew` in an **INVALID** state (`indisvalid = false`, but `indisready = true`).\n- This dead index is updated on every single INSERT and UPDATE, causing double index write amplification and consuming disk space, but the query planner will never use it.\n\n**3. Safe Recovery Procedure:**\n```sql\n-- Step 1: Identify invalid indexes in the database\nSELECT \n    c.relname AS index_name,\n    i.indisvalid,\n    i.indisready\nFROM pg_index i\nJOIN pg_class c ON c.oid = i.indexrelid\nWHERE NOT i.indisvalid;\n\n-- Step 2: Concurrently drop the leftover invalid temporary index\nDROP INDEX CONCURRENTLY IF EXISTS idx_orders_pkey_ccnew;\n\n-- Step 3: Run REINDEX CONCURRENTLY with statement_timeout disabled for this session\nSET statement_timeout = 0;\nREINDEX INDEX CONCURRENTLY idx_orders_pkey;\n```\nBecause `REINDEX CONCURRENTLY` on PostgreSQL 12+ acquires only `SHARE UPDATE EXCLUSIVE` locks, read and write queries against `orders` continue without blocking.",
    "followUp": {
      "question": "What official PostgreSQL extension can detect B-tree index logical corruption without waiting for queries to return wrong data?",
      "expectedAnswer": "The `amcheck` extension. It provides the function `bt_index_check(index_oid)` and `bt_index_parent_check(index_oid)` to verify the structural integrity of B-tree invariant ordering across all sibling and parent-child pages."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains why corrupt index returns 0 rows while seq scan succeeds",
      "Explains _ccnew leftover index and write amplification impact",
      "Details cleanup of invalid index and re-execution with statement_timeout = 0",
      "Mentions amcheck extension for structural verification"
    ]
  },
  "expectedConcepts": [
    "Index corruption causing index scan to miss rows found by sequential scan",
    "REINDEX CONCURRENTLY shadow index naming convention (_ccnew)",
    "Invalid index state (indisvalid = false) causing write amplification",
    "DROP INDEX CONCURRENTLY to clean up failed index builds",
    "Setting statement_timeout = 0 for heavy maintenance operations"
  ]
}
```
