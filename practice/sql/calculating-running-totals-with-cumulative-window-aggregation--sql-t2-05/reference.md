# Reference: Calculating Running Totals with Cumulative Window Aggregation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`SUM(total_amount) OVER (ORDER BY order_date ASC)` computes an unbounded cumulative sum from the first row up to the current row, defaulting to the frame `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.",
    "code": "SELECT id, order_date, total_amount, SUM(total_amount) OVER (ORDER BY order_date ASC) AS running_total FROM orders WHERE status = 'DELIVERED' ORDER BY order_date ASC;",
    "followUp": {
      "question": "What happens if two orders have the exact same order_date in SUM(...) OVER (ORDER BY order_date)?",
      "expectedAnswer": "Because the default frame is RANGE (not ROWS), all peer rows sharing the identical timestamp are evaluated together. Both rows will display the same running total including both orders. To force step-by-step accumulation, specify ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Proper cumulative SUM() OVER",
      "Filters delivered orders",
      "Ascending chronological order"
    ]
  },
  "expectedConcepts": [
    "Cumulative window sum",
    "Implicit frame default (RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)",
    "Chronological financial running totals"
  ]
}
```
