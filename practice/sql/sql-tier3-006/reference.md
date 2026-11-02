# Reference: Declarative Partitioning: Range, List, and Hash Strategies

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Declarative Range Partitioning Architecture:**\n```sql\n-- Create root partitioned table\nCREATE TABLE events (\n    id BIGINT GENERATED ALWAYS AS IDENTITY,\n    user_id INT NOT NULL,\n    event_name VARCHAR(100) NOT NULL,\n    metadata JSONB,\n    created_at TIMESTAMPTZ NOT NULL,\n    PRIMARY KEY (id, created_at) -- Partition key MUST be part of primary key\n) PARTITION BY RANGE (created_at);\n\n-- Create monthly child partitions\nCREATE TABLE events_2026_01 PARTITION OF events\n    FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2026-02-01 00:00:00+00');\nCREATE TABLE events_2026_02 PARTITION OF events\n    FOR VALUES FROM ('2026-02-01 00:00:00+00') TO ('2026-03-01 00:00:00+00');\nCREATE TABLE events_default PARTITION OF events DEFAULT;\n```\n\n**2. Partition Pruning:**\n- **Compile-time Pruning**: The query planner analyzes static WHERE clauses (e.g. `WHERE created_at >= '2026-02-01'`) and completely excludes non-matching partitions from the plan tree.\n- **Run-time Pruning**: For parameterized queries or subqueries (`WHERE created_at >= $1`), the executor skips reading partition scans during execution.\n\n**3. Primary Key & Indexing Constraint:**\nPostgreSQL does NOT support global indexes across partitions. Any UNIQUE or PRIMARY KEY constraint on the parent table **must** include the partition key (`created_at`).\n\n**4. Zero-Bloat Data Retention:**\nInstead of running `DELETE FROM events WHERE created_at < '2025-01-01';` (which writes WAL for millions of dead tuples and causes bloat), you simply execute:\n```sql\nDROP TABLE events_2025_01;\n-- or detach first to avoid holding locks during drop\nALTER TABLE events DETACH PARTITION events_2025_01 CONCURRENTLY;\nDROP TABLE events_2025_01;\n```\nThis operation is instantaneous, drops the underlying storage file at the OS level, and generates negligible WAL.",
    "followUp": {
      "question": "When would you choose Hash Partitioning over Range Partitioning, and what are its trade-offs?",
      "expectedAnswer": "Hash Partitioning (`PARTITION BY HASH (tenant_id)`) is chosen when there is no natural time-series dimension, but you need to distribute concurrent writes and high-volume data evenly across N partitions (e.g., 16 or 32 physical tables) to prevent single-table B-Tree lock contention and keep working sets inside memory. The trade-off is that range-based queries scan all hash partitions, and dropping a partition for data retention is impossible."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Provides correct DDL for partitioned table and child tables",
      "Explains why partition key must be part of primary key",
      "Explains compile-time and run-time partition pruning",
      "Demonstrates DROP / DETACH PARTITION for zero-bloat archiving"
    ]
  },
  "expectedConcepts": [
    "PARTITION BY RANGE syntax and monthly child partitions",
    "Partition key inclusion requirement in primary/unique keys",
    "Compile-time vs run-time partition pruning",
    "DROP TABLE / DETACH PARTITION CONCURRENTLY for instant archiving",
    "Lack of global indexes in PostgreSQL"
  ]
}
```
