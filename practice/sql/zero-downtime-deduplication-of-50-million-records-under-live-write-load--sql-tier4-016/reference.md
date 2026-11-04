# Reference: Zero-Downtime Deduplication of 50 Million Records Under Live Write Load

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Why a Single `DELETE ... WHERE id NOT IN (SELECT MIN(id)...)` Fails in Production:**\n- Running a single DELETE query across millions of duplicate rows locks all affected table rows, holds an exclusive write lock for minutes, blocks incoming payments, causes autovacuum freeze delays, and generates tens of gigabytes of WAL in a single transaction, risking replication lag and out-of-disk crashes.\n\n**2. Production Chunked Keyset Deduplication Pattern:**\n```sql\n-- Executed in a loop by an external migration script with SLEEP(0.05) between batches\nWITH batch_duplicates AS (\n    SELECT id\n    FROM (\n        SELECT \n            id,\n            ROW_NUMBER() OVER (\n                PARTITION BY order_id, transaction_ref \n                ORDER BY id ASC\n            ) AS row_num\n        FROM payments\n        WHERE id >= :batch_start_id AND id < :batch_end_id\n    ) sub\n    WHERE row_num > 1\n)\nDELETE FROM payments\nWHERE id IN (SELECT id FROM batch_duplicates)\nRETURNING id;\n```\n\n**3. Locking Invariant Safeguard:**\nOnce all duplicates are purged, immediately enforce the invariant using a unique index built concurrently:\n```sql\nCREATE UNIQUE INDEX CONCURRENTLY idx_payments_order_txn_uniq \nON payments (order_id, transaction_ref);\n```",
    "code": "WITH duplicates_in_chunk AS (\n    SELECT id\n    FROM (\n        SELECT \n            id,\n            ROW_NUMBER() OVER (\n                PARTITION BY order_id, transaction_ref \n                ORDER BY id ASC\n            ) AS rn\n        FROM payments\n        WHERE id BETWEEN 1 AND 5000\n    ) ranked\n    WHERE rn > 1\n)\nDELETE FROM payments\nWHERE id IN (SELECT id FROM duplicates_in_chunk)\nRETURNING id;",
    "followUp": {
      "question": "What risk exists if a duplicate pair spans across two different ID chunk boundaries (e.g. row 1 is ID 4,999 and row 2 is ID 5,001)?",
      "expectedAnswer": "If partitioning by ID ranges, duplicates that span across chunk boundaries will not see each other and will not be deleted. To avoid this, either batch by hash of the natural key (`WHERE hashtext(order_id::text) % 100 = :batch_num`), or perform the batching by paging through distinct `order_id` values rather than surrogate `id` values."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 15,
    "criteria": [
      "Implements ROW_NUMBER() window ranking for duplicate detection",
      "Limits scope to chunked batches to prevent lock holding",
      "Explains WAL and replication lag risks of monolithic deletes",
      "Identifies cross-boundary duplicate edge case and proposes unique constraint"
    ]
  },
  "expectedConcepts": [
    "Why monolithic DELETE fails in production (locks, WAL explosion, replication lag)",
    "Chunked keyset pagination (id BETWEEN x AND y)",
    "ROW_NUMBER() window partitioning for duplicate identification",
    "Small batch transactions with sleep throttle",
    "CREATE UNIQUE INDEX CONCURRENTLY to prevent recurrence"
  ]
}
```
