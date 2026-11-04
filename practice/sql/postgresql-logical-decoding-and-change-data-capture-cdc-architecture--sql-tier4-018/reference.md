# Reference: PostgreSQL Logical Decoding and Change Data Capture (CDC) Architecture

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Critique of Polling Queries (`WHERE updated_at > ?`):**\n- **Misses Deletes**: Hard `DELETE` operations leave no row behind to query.\n- **Database Load**: Frequent polling queries (e.g. every 500ms) thrash indexes and buffer pool caches.\n- **Clock Skew & In-Flight Transactions**: A transaction that began at 12:00:00 but committed at 12:00:05 might be skipped if the polling script queried at 12:00:01.\n\n**2. PostgreSQL Logical Decoding Architecture:**\n- PostgreSQL reads committed mutations directly from the Write-Ahead Log (**WAL**), bypassing SQL querying entirely.\n- A **logical replication slot** tracks the exact LSN progress of the consumer.\n- The output plugin (e.g. `pgoutput` or `test_decoding`) decodes internal WAL binary into structured row change events (Insert, Update, Delete) with old/new column values.\n- Tools like **Debezium** stream these events directly to Kafka topics with sub-millisecond latency and zero query overhead on PostgreSQL.\n\n**3. REPLICA IDENTITY Configuration:**\n- When a row is updated or deleted, CDC consumers need to identify the exact row that changed.\n- **`REPLICA IDENTITY DEFAULT`**: WAL records only the old PRIMARY KEY for UPDATE and DELETE operations. Highly efficient.\n- **`REPLICA IDENTITY FULL`**: WAL records the **entire old row image** prior to update/delete. Mandatory if a table lacks a primary key, but significantly increases WAL volume.",
    "followUp": {
      "question": "What disaster occurs if the downstream Debezium connector disconnects for 48 hours while the logical replication slot remains active?",
      "expectedAnswer": "Because the logical replication slot is active, PostgreSQL guarantees not to remove any WAL files generated after the slot’s restart LSN. If writes continue on the primary, hundreds of gigabytes of WAL will accumulate in `pg_wal`, threatening disk exhaustion unless `max_slot_wal_keep_size` is configured."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Itemizes reasons why polling updated_at fails for reliable CDC",
      "Details WAL reading, logical decoding plugins, and replication slots",
      "Explains Debezium and Kafka streaming integration",
      "Differentiates REPLICA IDENTITY DEFAULT from FULL"
    ]
  },
  "expectedConcepts": [
    "Shortcomings of polling queries (missed deletes, transaction race conditions, I/O load)",
    "WAL-based logical decoding streaming committed transactions",
    "Logical replication slots and LSN offset tracking",
    "Debezium + Kafka event streaming integration",
    "REPLICA IDENTITY DEFAULT (PK only) vs FULL (complete old row)"
  ]
}
```
