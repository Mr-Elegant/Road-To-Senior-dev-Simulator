# Reference: Understanding PostgreSQL MVCC: Tuple Headers and xmin / xmax

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "MVCC ensures that \"readers never block writers, and writers never block readers\". Instead of overwriting row data in-place on UPDATE, PostgreSQL writes a brand-new row version (tuple). Every tuple has hidden header metadata:\n- `xmin`: The transaction ID that inserted this tuple.\n- `xmax`: The transaction ID that deleted or updated this tuple (0 if active).\nWhen a query runs, PostgreSQL compares its transaction snapshot against each tuple's `xmin` and `xmax`. If `xmin` is committed before the snapshot and `xmax` is either uncommitted or created after the snapshot, the tuple is visible to that reader.",
    "followUp": {
      "question": "What happens to dead row versions (tuples where xmax is committed and expired) over time?",
      "expectedAnswer": "Dead tuples remain on disk and cause table bloat until PostgreSQL's VACUUM (or autovacuum) process scans the table, reclaims the dead space, and updates the Free Space Map (FSM)."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Defines MVCC principle",
      "Explains xmin and xmax roles",
      "Explains snapshot comparison"
    ]
  },
  "expectedConcepts": [
    "Multi-Version Concurrency Control (MVCC)",
    "Readers do not block writers, writers do not block readers",
    "xmin (creation transaction ID)",
    "xmax (deletion/update transaction ID)",
    "Tuple visibility determination"
  ]
}
```
