# Reference: Materialized Views with REFRESH CONCURRENTLY

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Materialized View Fundamentals:**\n- A standard PostgreSQL `VIEW` is a stored query that is evaluated on every execution.\n- A `MATERIALIZED VIEW` stores the physical result of the query on disk in a heap table, allowing indexes to be built on it and delivering sub-millisecond read access.\n\n**2. Standard vs Concurrent Refresh:**\n- **Standard REFRESH**: Acquires an `ACCESS EXCLUSIVE` lock on the materialized view. It completely locks out all concurrent reads (`SELECT`) while it recalculates the view and replaces the heap file. Any read query blocks until refresh completes.\n- **REFRESH CONCURRENTLY**: Acquires only an `EXCLUSIVE` lock. Concurrent reads (`SELECT`) continue without blocking, reading the old version of the view while the refresh is underway.\n\n**3. Prerequisite for CONCURRENT:**\nThe materialized view **must have at least one UNIQUE index** on a column or set of columns with no `WHERE` clause. Postgres uses this unique index to perform an in-place diff (inserting new rows, updating modified rows, and deleting removed rows) between the old data and the newly computed result.\n\n**4. Trade-offs:**\n- Concurrent refresh is slower and consumes significantly more temporary disk space and WAL because it must write the new query result to a temporary table, perform diff joins against the existing unique index, and apply atomic row updates.",
    "followUp": {
      "question": "Can a materialized view with `REFRESH MATERIALIZED VIEW CONCURRENTLY` be updated incrementally (only calculating rows changed since last refresh)?",
      "expectedAnswer": "No. PostgreSQL core does not support Incremental View Maintenance (IVM). Every refresh re-executes the complete underlying query from scratch and diffs the entire result set against the existing view. For true incremental updates, extensions like `pg_ivm` or trigger-based rollup tables are required."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Differentiates ACCESS EXCLUSIVE from EXCLUSIVE lock modes",
      "States mandatory requirement for a non-partial UNIQUE index",
      "Explains diff mechanism and why concurrent refresh is slower",
      "Recognizes lack of core Incremental View Maintenance (IVM)"
    ]
  },
  "expectedConcepts": [
    "ACCESS EXCLUSIVE lock of standard refresh blocking concurrent reads",
    "REFRESH CONCURRENTLY allowing concurrent SELECT queries",
    "Mandatory UNIQUE index requirement without partial clauses",
    "Diff calculation mechanics using temporary table and unique key",
    "Performance and WAL trade-offs of concurrent refresh"
  ]
}
```
