# Reference: Production Incident: Cascading Lock Pileup Caused by Missing Foreign Key Index

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Foreign Key Verification Mechanics:**\n- When a row is deleted or has its primary key updated in a parent table (`customers`), PostgreSQL must verify that no child rows in `orders` reference that parent row (`ON DELETE RESTRICT/NO ACTION`) or cascade the delete (`ON DELETE CASCADE`).\n- To perform this check, PostgreSQL queries the child table: `SELECT 1 FROM orders WHERE customer_id = $1`.\n- **The Critical Trap**: PostgreSQL automatically creates a unique index on the parent table’s PRIMARY KEY, but **it NEVER automatically creates an index on foreign key columns in child tables**.\n- Without an index on `orders(customer_id)`, every single parent row deletion triggers a **full sequential scan of the 40-million row `orders` table** while holding row locks, locking out concurrent writes and exhausting connection pools.\n\n**2. System Catalog Query to Detect All Unindexed Foreign Keys:**\n```sql\nSELECT \n    c.conrelid::regclass AS child_table,\n    c.conname AS foreign_key_name,\n    string_agg(a.attname, ', ' ORDER BY array_position(c.conkey, a.attnum)) AS fk_columns\nFROM pg_constraint c\nJOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)\nWHERE c.contype = 'f'\n  AND NOT EXISTS (\n      SELECT 1 FROM pg_index i\n      WHERE i.indrelid = c.conrelid\n        AND i.indkey[0:array_length(c.conkey, 1) - 1] = c.conkey\n  )\nGROUP BY c.conrelid, c.conname;\n```\n\n**3. Remediation:**\n```sql\nCREATE INDEX CONCURRENTLY idx_orders_customer_id ON orders(customer_id);\n```",
    "followUp": {
      "question": "Does an `INSERT` into the child table (`orders`) require an index on `orders(customer_id)` to verify the foreign key?",
      "expectedAnswer": "No. An insert into the child table only needs to verify that the parent customer exists (`SELECT 1 FROM customers WHERE id = $1`). Because `customers.id` is the primary key, it is already indexed. The missing index on the child table only harms parent `DELETE` and parent `UPDATE` operations."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains why parent DELETE triggers child table scans",
      "Highlights that foreign keys are not automatically indexed in PostgreSQL",
      "Provides accurate system catalog query to detect unindexed foreign keys",
      "Recommends CREATE INDEX CONCURRENTLY mitigation"
    ]
  },
  "expectedConcepts": [
    "Child table scan on parent row deletion",
    "PostgreSQL does NOT automatically index foreign keys",
    "Full sequential scan of child table under lock for every deleted parent row",
    "System catalog query comparing pg_constraint with pg_index",
    "CREATE INDEX CONCURRENTLY on foreign key column"
  ]
}
```
