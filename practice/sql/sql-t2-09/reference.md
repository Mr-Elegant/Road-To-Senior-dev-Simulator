# Reference: Combining Result Sets with UNION and UNION ALL

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`UNION ALL` concatenates the two result sets directly without incurring the performance cost of deduplication. `ORDER BY` placed at the very end sorts the unified stream.",
    "code": "SELECT type, amount, created_at FROM transactions WHERE type = 'DISBURSEMENT' UNION ALL SELECT type, amount, created_at FROM transactions WHERE type = 'EMI_REPAYMENT' ORDER BY created_at ASC;",
    "followUp": {
      "question": "Why should UNION ALL be preferred over UNION unless deduplication is explicitly required?",
      "expectedAnswer": "UNION forces the database to sort the combined dataset and perform a deduplication pass (similar to DISTINCT). UNION ALL performs zero sorting, appending buffers directly, which is significantly faster and lower on memory."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Proper UNION ALL syntax",
      "Matching column types",
      "Chronological sorting"
    ]
  },
  "expectedConcepts": [
    "UNION ALL operator",
    "Performance difference: UNION vs UNION ALL",
    "Result set schema compatibility"
  ]
}
```
