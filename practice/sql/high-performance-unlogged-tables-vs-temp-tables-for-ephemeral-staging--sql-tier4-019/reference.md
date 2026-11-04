# Reference: High-Performance Unlogged Tables vs Temp Tables for Ephemeral Staging

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. What Unlogged Tables Do:**\n- Created via `CREATE UNLOGGED TABLE staging_orders (...);`.\n- **Bypasses WAL Completely**: Writes to unlogged tables never write WAL records. This eliminates disk write amplification, WAL flushing sync bottlenecks, and checkpoint pressure, speeding up bulk inserts by **3x to 10x**.\n\n**2. Crash Recovery & Durability Semantics:**\n- Because there is no WAL to replay after an unclean shutdown, PostgreSQL cannot guarantee data consistency for unlogged tables.\n- Upon crash recovery restart, PostgreSQL **automatically truncates all UNLOGGED tables to 0 rows** (recreating an empty table file using the init fork `_init`).\n- Data is durable across clean server restarts, but wiped on power failure or crash.\n\n**3. Streaming Replication Behavior:**\n- Because read-replicas are synchronized exclusively by replaying WAL streams, **UNLOGGED tables do not replicate to standby nodes**.\n- On replicas, unlogged tables appear permanently empty or inaccessible.\n\n**4. Comparison with TEMP Tables:**\n- `TEMP TABLE`: Session-scoped, visible only to the creating connection, dropped when session closes. Stored in special `pg_temp` schemas. Causes catalog churn if created repeatedly in connection pools.\n- `UNLOGGED TABLE`: Cluster-wide, visible to all concurrent connections and processes, permanent schema definition, but ephemeral data.",
    "followUp": {
      "question": "Can an UNLOGGED table be altered to a regular logged table once the bulk load finishes, and what lock does that require?",
      "expectedAnswer": "Yes, using `ALTER TABLE staging_orders SET LOGGED;`. This command forces PostgreSQL to write all existing table pages into the WAL so that the table becomes durable and replicates to standbys. It acquires an `ACCESS EXCLUSIVE` lock on the table for the duration of the WAL write."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains WAL bypass and write acceleration",
      "Details crash recovery truncation behavior and init fork",
      "Identifies replication absence on streaming standbys",
      "Contrasts multi-connection visibility against session temp tables"
    ]
  },
  "expectedConcepts": [
    "Bypassing Write-Ahead Logging for maximum write speed",
    "Automatic truncation to empty table upon crash recovery restart",
    "Initialization fork (_init) mechanism",
    "Non-replication to streaming read standbys",
    "Cluster-wide visibility vs session-scoped TEMP tables"
  ]
}
```
