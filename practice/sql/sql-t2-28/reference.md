# Reference: SQL Upsert Patterns: INSERT ... ON CONFLICT DO UPDATE

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "```sql\nINSERT INTO user_daily_views (user_id, view_date, view_count)\nVALUES (101, '2024-03-20', 1)\nON CONFLICT (user_id, view_date)\nDO UPDATE SET view_count = user_daily_views.view_count + EXCLUDED.view_count;\n```\nWhy it is superior: A `SELECT` followed by `INSERT/UPDATE` in application code has an inherent race condition (Check-Then-Act). Two concurrent requests will both see no row and both attempt `INSERT`, causing a duplicate key violation. `ON CONFLICT` is an atomic, in-engine operation that handles concurrency safely at the row level.",
    "followUp": {
      "question": "What is required on the target columns (user_id, view_date) for ON CONFLICT to work?",
      "expectedAnswer": "A unique constraint or unique index must exist on the conflict target columns (user_id, view_date). Without a unique constraint, PostgreSQL throws an error because it cannot identify a conflict boundary."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Accurate ON CONFLICT DO UPDATE syntax",
      "Uses EXCLUDED properly",
      "Explains concurrency race condition"
    ]
  },
  "expectedConcepts": [
    "ON CONFLICT target column specification",
    "EXCLUDED pseudo-record",
    "Atomic upsert concurrency guarantee",
    "Check-then-act race prevention"
  ]
}
```
