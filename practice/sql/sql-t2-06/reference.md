# Reference: Prior Period Comparison with LAG()

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`LAG(amount, 1) OVER (ORDER BY billing_date ASC)` fetches the value of `amount` from 1 row prior in the sorted window. For the first row, it cleanly evaluates to `NULL`.",
    "code": "SELECT id, billing_date, amount, LAG(amount, 1) OVER (ORDER BY billing_date ASC) AS prev_amount FROM invoices WHERE organization_id = 101 ORDER BY billing_date ASC;",
    "followUp": {
      "question": "How do you provide a default fallback value if LAG() encounters the first row (instead of NULL)?",
      "expectedAnswer": "LAG accepts an optional third argument: LAG(amount, 1, 0.00). If the preceding row does not exist, it returns 0.00 instead of NULL."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Proper LAG usage",
      "Correctly filters organization 101",
      "First invoice has NULL prev_amount"
    ]
  },
  "expectedConcepts": [
    "LAG() window function",
    "Offset navigation",
    "First-row NULL handling"
  ]
}
```
