# Reference: Zero-Downtime Schema Migrations: Safe Index Creation & Column Additions

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Why the Migration Crashed Production:**\n- `CREATE INDEX` takes a `SHARE` lock on the table, which blocks all concurrent `INSERT`, `UPDATE`, and `DELETE` transactions until the entire index is built across 40M rows (several minutes).\n- Incoming write queries queue behind the lock. Subsequent read queries queue behind the waiting writes, exhausting the connection pool and causing complete API failure.\n- (Note: In PG 11+, `ADD COLUMN ... DEFAULT ... NOT NULL` is fast metadata-only, but in PG 10 and below it rewritten the entire table under `ACCESS EXCLUSIVE` lock).\n\n**2. The Safe Zero-Downtime Recipe:**\n\n```sql\n-- Step 1: Add column as nullable without default (instant metadata-only lock)\nALTER TABLE orders ADD COLUMN tracking_code VARCHAR(64);\n\n-- Step 2: Set default for future inserts (metadata only)\nALTER TABLE orders ALTER COLUMN tracking_code SET DEFAULT 'PENDING';\n\n-- Step 3: Backfill existing rows in small batches (e.g., 5,000 rows per transaction) to avoid locks\n-- (Executed via background worker script: UPDATE orders SET tracking_code = 'PENDING' WHERE tracking_code IS NULL AND id BETWEEN ...)\n\n-- Step 4: Add NOT NULL check constraint without validating table\nALTER TABLE orders ADD CONSTRAINT chk_tracking_not_null CHECK (tracking_code IS NOT NULL) NOT VALID;\n\n-- Step 5: Validate constraint concurrently (acquires only SHARE UPDATE EXCLUSIVE lock; reads do not block writes)\nALTER TABLE orders VALIDATE CONSTRAINT chk_tracking_not_null;\n\n-- Step 6: Create index concurrently without blocking writes\nCREATE INDEX CONCURRENTLY idx_orders_tracking ON orders(tracking_code);\n```",
    "followUp": {
      "question": "What does `CREATE INDEX CONCURRENTLY` do if it fails midway (e.g. due to a unique constraint violation or deadlock)? What state is the index left in, and how do you fix it?",
      "expectedAnswer": "If it fails, Postgres leaves an `INVALID` index in place (`idx_orders_tracking INVALID`). It will not be used for queries, but it will still be updated on every INSERT/UPDATE/DELETE, causing write overhead and bloat. You must drop it (`DROP INDEX CONCURRENTLY idx_orders_tracking;`) and investigate the failure before retrying."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains lock queue cascading failure caused by standard CREATE INDEX",
      "Specifies CREATE INDEX CONCURRENTLY",
      "Uses NOT VALID and VALIDATE CONSTRAINT for zero-downtime NOT NULL",
      "Explains invalid index state on concurrent build failure"
    ]
  },
  "expectedConcepts": [
    "SHARE lock of standard CREATE INDEX blocking all writes",
    "Lock queue pileup: writes blocked by DDL, reads blocked by queued writes",
    "CREATE INDEX CONCURRENTLY using 2-pass table scan",
    "NOT VALID check constraint followed by VALIDATE CONSTRAINT",
    "Batch backfilling to prevent transaction lock exhaustion"
  ]
}
```
