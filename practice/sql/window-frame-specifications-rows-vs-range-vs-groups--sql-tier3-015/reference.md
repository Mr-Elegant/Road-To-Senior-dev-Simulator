# Reference: Window Frame Specifications: ROWS vs RANGE vs GROUPS

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Frame Mode Differences:**\n- **ROWS**: Operates on physical row offsets relative to current row regardless of duplicate values in `ORDER BY`. `ROWS BETWEEN 1 PRECEDING AND CURRENT ROW` always evaluates exactly 1 or 2 physical rows.\n- **RANGE**: Operates on logical value offsets of the `ORDER BY` expression. All peer rows with identical `ORDER BY` values are included in the frame together. In PostgreSQL 11+, supports numeric/date intervals (e.g. `RANGE BETWEEN '3 days' PRECEDING AND CURRENT ROW`).\n- **GROUPS**: Operates on groups of tied peer values. `GROUPS BETWEEN 1 PRECEDING AND CURRENT ROW` includes the current group of tied values plus the single preceding group of tied values.\n\n**2. Default Frame Hazard:**\nWhen `ORDER BY` is specified without an explicit frame, the SQL standard default is:\n`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`\nThis default causes peer rows with tied values to sum together unexpectedly rather than evaluating sequentially row-by-row.",
    "code": "SELECT \n    id,\n    loan_id,\n    payment_date,\n    amount,\n    AVG(amount) OVER (\n        PARTITION BY loan_id \n        ORDER BY payment_date, id \n        ROWS BETWEEN 1 PRECEDING AND CURRENT ROW\n    ) AS physical_2row_avg,\n    SUM(amount) OVER (\n        PARTITION BY loan_id \n        ORDER BY amount\n        RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS range_accum_sum\nFROM repayments\nORDER BY loan_id, payment_date;",
    "followUp": {
      "question": "Why can `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` cause significant performance degradation compared to `ROWS`?",
      "expectedAnswer": "With `ROWS`, the window executor maintains a simple running state (accumulating one value and subtracting one value per row). With `RANGE`, Postgres must inspect peer rows to find ties, requiring buffering and re-evaluating peer groups, which prevents certain streaming window aggregate optimizations."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 15,
    "criteria": [
      "Differentiates ROWS, RANGE, and GROUPS clearly",
      "Explains peer group tie behavior in RANGE",
      "Identifies the default frame trap in SQL standard",
      "Produces valid SQL demonstrating both framing modes"
    ]
  },
  "expectedConcepts": [
    "ROWS operates on physical row offsets",
    "RANGE operates on logical value boundaries (peers lumped together)",
    "GROUPS operates on peer rank clusters",
    "Default window frame trap: RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW"
  ]
}
```
