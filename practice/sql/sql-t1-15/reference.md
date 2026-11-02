# Reference: Conditional Aggregation with CASE WHEN

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`SUM(CASE WHEN condition THEN 1 ELSE 0 END)` or `COUNT(CASE WHEN condition THEN 1 END)` conditionally accumulates counts without needing multiple queries.",
    "code": "SELECT COUNT(*) AS total_emis, SUM(CASE WHEN status = 'PAID' THEN 1 ELSE 0 END) AS paid_count, SUM(CASE WHEN status = 'OVERDUE' THEN 1 ELSE 0 END) AS overdue_count FROM emi_schedule;",
    "followUp": {
      "question": "How does PostgreSQL's native FILTER (WHERE condition) clause simplify conditional aggregation?",
      "expectedAnswer": "PostgreSQL supports standard SQL:2003 aggregate filters: COUNT(*) FILTER (WHERE status = 'PAID'). This is cleaner, faster, and avoids the verbose CASE WHEN expression."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Correct CASE WHEN structure",
      "Accurate paid and overdue tallies"
    ]
  },
  "expectedConcepts": [
    "CASE WHEN statement",
    "Conditional aggregation",
    "Pivot logic"
  ]
}
```
