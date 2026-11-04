# Reference: Loan Approval Rates and Risk Categorization

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Summarizes loan volume and capital demand by grouping on `purpose` and aggregating with `COUNT(*)` and `SUM(requested_amount)`.",
    "code": "SELECT purpose, COUNT(*) AS total_applications, SUM(requested_amount) AS total_amount_requested FROM loan_applications GROUP BY purpose ORDER BY total_amount_requested DESC;",
    "followUp": {
      "question": "Why should financial figures always use numeric/decimal types rather than float/double in SQL?",
      "expectedAnswer": "Floating-point types (FLOAT/REAL) use binary approximations (IEEE 754) that cause rounding errors (e.g., 0.1 + 0.2 = 0.30000000000000004). Financial ledgers require arbitrary-precision fixed-point types (NUMERIC/DECIMAL) to guarantee exact balance calculations."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Accurate group totals",
      "Sorted by requested amount descending"
    ]
  },
  "expectedConcepts": [
    "GROUP BY categorization",
    "SUM financial totals",
    "NBFC credit analytics"
  ]
}
```
