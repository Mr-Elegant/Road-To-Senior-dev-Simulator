# Reference: High-Throughput TimescaleDB / Hypertable Architecture vs Native Partitioning

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Chunk Management & Write Throughput:**\n- **Native Partitioning**: Requires pre-creating child tables or using an external script/trigger. Planner overhead increases linearly with partition count, degrading query performance when hundreds of partitions exist.\n- **TimescaleDB Hypertables**: Automatically creates physical 2D chunks (time intervals + space/hash partitions) dynamically on-the-fly as data arrives. Keeps current chunk indexes small enough to fit 100% inside `shared_buffers`, maintaining flat write ingestion (>100k writes/sec) without performance drop-off.\n\n**2. Hybrid Columnar Compression:**\n- Native PostgreSQL only supports row-oriented storage with basic TOAST compression.\n- TimescaleDB converts historical closed chunks into a compressed **columnar format** on disk:\n  - Groups rows by segment key (e.g. `tenant_id`) and stores each column as an array compressed with specialized algorithms (Delta-of-delta for timestamps, Gorilla/XOR for floats, Run-Length Encoding for enums).\n  - Delivers **90-95% disk space reduction** and 10x-50x faster analytical scans because queries read only required columns.\n\n**3. Continuous Aggregates:**\n- Native PostgreSQL Materialized Views must be refreshed in full or require complex trigger rollups.\n- TimescaleDB Continuous Aggregates update automatically and incrementally in the background as new data arrives. When queried, TimescaleDB seamlessly combines historical aggregated chunks with unaggregated live raw data from the current chunk.\n\n**4. Data Retention:**\n- Dropping old chunks via `SELECT drop_chunks('1 year'::interval);` is instantaneous metadata-only deletion with zero WAL write amplification.",
    "followUp": {
      "question": "Can compressed TimescaleDB chunks be updated or deleted using standard SQL `UPDATE` / `DELETE` statements?",
      "expectedAnswer": "Historically, compressed chunks were strictly read-only. In modern TimescaleDB (v2.1+), PostgreSQL automatically decompresses the affected rows behind the scenes, executes the UPDATE or DELETE, and re-compresses them, though frequent updates to compressed chunks should still be avoided due to CPU overhead."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Contrasts automated chunking with manual native partitioning",
      "Explains columnar chunk compression and specialized algorithms",
      "Details continuous aggregates and real-time query aggregation",
      "Evaluates retention policy automation (drop_chunks)"
    ]
  },
  "expectedConcepts": [
    "Automatic chunk creation fitting working set in shared_buffers",
    "TimescaleDB columnar compression algorithms (Gorilla, Delta-of-delta)",
    "90%+ storage savings via chunk compression",
    "Incremental Continuous Aggregates combining raw and rolled-up data",
    "drop_chunks() zero-bloat automated retention policies"
  ]
}
```
