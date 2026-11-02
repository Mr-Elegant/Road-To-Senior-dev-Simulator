# Reference: Zero-Downtime Column Rename and Type Migration in 24/7 Production

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**The Zero-Downtime Expand-and-Contract Migration Pattern:**\n\n**Phase 1: Expand (Add New Column & Dual-Write Trigger)**\n```sql\n-- 1. Add new column as nullable (instant metadata lock in PG 11+)\nALTER TABLE orders ADD COLUMN amount_cents BIGINT;\n\n-- 2. Create dual-write trigger function so new writes populate both old and new columns\nCREATE OR REPLACE FUNCTION trg_sync_orders_amount()\nRETURNS TRIGGER AS $$\nBEGIN\n    IF NEW.amount_cents IS NULL AND NEW.amount IS NOT NULL THEN\n        NEW.amount_cents := NEW.amount * 100;\n    ELSIF NEW.amount_cents IS NOT NULL AND NEW.amount IS NULL THEN\n        NEW.amount := (NEW.amount_cents / 100)::INT;\n    END IF;\n    RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trg_orders_amount_sync\nBEFORE INSERT OR UPDATE ON orders\nFOR EACH ROW EXECUTE FUNCTION trg_sync_orders_amount();\n```\n\n**Phase 2: Historical Batch Backfill (No Table Locks)**\nRun a background worker updating existing records in chunks of 5,000 using keyset pagination:\n```sql\n-- Run in loop with sleep(0.05) between batches\nUPDATE orders\nSET amount_cents = amount * 100\nWHERE id BETWEEN 1 AND 5000\n  AND amount_cents IS NULL;\n```\n\n**Phase 3: Deploy Application Code (Read & Write New Column)**\n- Deploy new application code that reads from and writes to `amount_cents`.\n\n**Phase 4: Contract (Drop Trigger & Old Column)**\n```sql\n-- 1. Add NOT NULL constraint safely using NOT VALID and VALIDATE\nALTER TABLE orders ADD CONSTRAINT chk_amount_cents_not_null CHECK (amount_cents IS NOT NULL) NOT VALID;\nALTER TABLE orders VALIDATE CONSTRAINT chk_amount_cents_not_null;\n\n-- 2. Drop the sync trigger\nDROP TRIGGER trg_orders_amount_sync ON orders;\nDROP FUNCTION trg_sync_orders_amount();\n\n-- 3. Drop old column (metadata-only lock in PG)\nALTER TABLE orders DROP COLUMN amount;\n```",
    "followUp": {
      "question": "Instead of triggers, can generated columns (`GENERATED ALWAYS AS ... STORED`) be used to migrate column types?",
      "expectedAnswer": "No, because PostgreSQL `STORED` generated columns cannot be written to directly by application inserts or updates. Furthermore, adding a `STORED` generated column in PostgreSQL requires rewriting the entire table on disk under an `ACCESS EXCLUSIVE` lock, defeating zero-downtime objectives."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains why ALTER COLUMN TYPE causes table rewrite and downtime",
      "Provides dual-write trigger synchronization logic",
      "Details non-blocking chunked backfill using keyset ranges",
      "Validates constraints safely without table rewrite"
    ]
  },
  "expectedConcepts": [
    "Expand-and-contract (parallel-run) migration methodology",
    "Dual-write trigger to synchronize live writes during transition",
    "Keyset batch backfill with pause to prevent lock and WAL saturation",
    "NOT VALID check constraint followed by VALIDATE CONSTRAINT",
    "Zero application downtime and rollback capability"
  ]
}
```
