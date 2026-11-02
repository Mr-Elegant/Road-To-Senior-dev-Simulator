# Reference: Zero-Downtime NOT NULL Constraint Addition on 100-Million Row Tables

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Why Standard `SET NOT NULL` Causes Downtime:**\n- `ALTER TABLE orders ALTER COLUMN customer_id SET NOT NULL;` requires an **`ACCESS EXCLUSIVE` lock** on the table.\n- Under this exclusive lock, PostgreSQL performs a full sequential scan of all 100 million rows in the heap table to prove that zero NULL values exist.\n- While the table is being scanned (3 to 5 minutes), **no other query can read or write to the table**, resulting in a complete application outage.\n\n**2. The Zero-Downtime 2-Step Recipe:**\n\n```sql\n-- Step 1: Add check constraint marked NOT VALID\n-- Acquires an ACCESS EXCLUSIVE lock for only a fraction of a millisecond to update metadata catalog.\n-- New inserts and updates will immediately enforce NOT NULL.\nALTER TABLE orders \nADD CONSTRAINT chk_orders_customer_id_not_null \nCHECK (customer_id IS NOT NULL) NOT VALID;\n\n-- Step 2: Validate constraint in a separate statement\n-- Acquires only a SHARE UPDATE EXCLUSIVE lock.\n-- Concurrent SELECT, INSERT, UPDATE, and DELETE operations continue running normally!\nALTER TABLE orders \nVALIDATE CONSTRAINT chk_orders_customer_id_not_null;\n```\n\n**3. PostgreSQL 12+ True `SET NOT NULL` Optimization:**\n- In PostgreSQL 12+, once a valid `CHECK (col IS NOT NULL)` constraint exists on the table, running:\n```sql\nALTER TABLE orders ALTER COLUMN customer_id SET NOT NULL;\n```\nwill recognize the existing check constraint and set the column's `attnotnull` catalog flag **instantly without re-scanning the table**! You can then safely drop the redundant check constraint.",
    "followUp": {
      "question": "Why is converting the check constraint to a native `SET NOT NULL` desirable in PostgreSQL 12+ rather than leaving the check constraint permanently?",
      "expectedAnswer": "A native `attnotnull` flag in PostgreSQL's catalog is directly understood by the query planner for optimizations (e.g. proof of non-nullability in outer joins and anti-joins) and avoids the minor overhead of evaluating check constraints during execution."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains ACCESS EXCLUSIVE full table scan bottleneck",
      "Implements CHECK ... NOT VALID instant step",
      "Implements VALIDATE CONSTRAINT non-blocking validation",
      "Explains PG 12+ instant promotion to native attnotnull"
    ]
  },
  "expectedConcepts": [
    "ACCESS EXCLUSIVE lock held during full table scan in standard SET NOT NULL",
    "CHECK (col IS NOT NULL) NOT VALID instant metadata lock",
    "VALIDATE CONSTRAINT running under SHARE UPDATE EXCLUSIVE (concurrent DML allowed)",
    "PostgreSQL 12+ instant promotion from validated check constraint to attnotnull",
    "Dropping redundant check constraint after attnotnull is set"
  ]
}
```
