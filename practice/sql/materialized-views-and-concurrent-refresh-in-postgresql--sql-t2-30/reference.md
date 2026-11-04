# Reference: Materialized Views and Concurrent Refresh in PostgreSQL

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A Materialized View physically caches the result set of an expensive query on disk as a table-like object (`CREATE MATERIALIZED VIEW monthly_financial_summary AS ...`). Reading from it takes 2ms instead of 25 seconds.\nA standard `REFRESH MATERIALIZED VIEW` takes an exclusive read lock on the view, blocking all dashboard queries while it recomputes.\n`REFRESH MATERIALIZED VIEW CONCURRENTLY` allows concurrent reads while refreshing! It computes the new data into a temporary table, diffs it against the old view, and applies updates in place. REQUIREMENT: A unique index must exist on the materialized view (`CREATE UNIQUE INDEX ON monthly_financial_summary (year, month);`) to allow row-by-row diffing.",
    "followUp": {
      "question": "What is the downside of REFRESH MATERIALIZED VIEW CONCURRENTLY compared to a standard refresh?",
      "expectedAnswer": "It takes longer to execute and uses more CPU/WAL because it must perform a full relational diff and apply updates individually rather than bulk-replacing the file."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Defines Materialized View",
      "Explains non-blocking concurrent refresh",
      "States mandatory unique index requirement"
    ]
  },
  "expectedConcepts": [
    "Materialized View disk persistence",
    "Sub-millisecond analytical reads",
    "REFRESH MATERIALIZED VIEW CONCURRENTLY non-blocking operation",
    "Mandatory unique index requirement for concurrent refresh"
  ]
}
```
