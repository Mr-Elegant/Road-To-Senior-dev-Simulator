# Reference: PostgreSQL Extensions: pg_stat_statements and Performance Profiling

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Architecture and Normalization:**\n- `pg_stat_statements` hooks directly into the PostgreSQL query execution pipeline (ExecutorStart, ExecutorRun, ExecutorFinish).\n- It **normalizes** SQL queries by replacing literal constants with parameter placeholders (`$1, $2`), aggregating identical query structures into a single row identified by `queryid`.\n- Must be preloaded in `shared_preload_libraries = 'pg_stat_statements'` because it allocates shared memory at server boot.\n\n**2. Top Resource-Intensive Queries Diagnostic SQL:**\n```sql\nSELECT \n    queryid,\n    substring(query, 1, 80) AS query_snippet,\n    calls,\n    round(total_exec_time::numeric, 2) AS total_time_ms,\n    round(mean_exec_time::numeric, 2) AS avg_time_ms,\n    round((100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0))::numeric, 2) AS cache_hit_pct,\n    shared_blks_read AS disk_reads,\n    shared_blks_dirtied AS disk_dirtied\nFROM pg_stat_statements\nWHERE query NOT LIKE '%pg_stat_statements%'\nORDER BY total_exec_time DESC\nLIMIT 5;\n```\n\n**3. Key Metrics to Watch:**\n- `mean_exec_time`: Identifies inherently slow, unindexed queries.\n- `calls * mean_exec_time` (`total_exec_time`): Identifies high-frequency N+1 query patterns that dominate total database load.\n- Low `cache_hit_pct`: Identifies queries reading cold data from disk, thrashing `shared_buffers`.",
    "followUp": {
      "question": "How does `pg_stat_statements_reset()` interact with production monitoring, and when should it be executed?",
      "expectedAnswer": "`pg_stat_statements_reset()` clears all accumulated counters back to zero. It should be executed immediately after deploying major schema migrations or index additions so that post-deployment metrics reflect only new query plans rather than being skewed by months of historical pre-optimization counters."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains query normalization and queryid aggregation",
      "Provides valid diagnostic SQL querying pg_stat_statements",
      "Computes buffer cache hit ratio accurately",
      "Distinguishes total time (frequency) from average latency"
    ]
  },
  "expectedConcepts": [
    "Query normalization via queryid parameterization",
    "shared_preload_libraries requirement",
    "total_exec_time vs mean_exec_time distinction",
    "Buffer cache hit ratio formula (shared_blks_hit vs shared_blks_read)",
    "Identifying high-frequency N+1 queries vs slow individual queries"
  ]
}
```
