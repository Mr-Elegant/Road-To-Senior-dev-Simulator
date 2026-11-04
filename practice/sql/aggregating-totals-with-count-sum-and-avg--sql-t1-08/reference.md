# Reference: Aggregating Totals with COUNT, SUM, and AVG

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`COUNT(*)` tallies rows, `SUM(total_amount)` totals revenue, and `AVG(total_amount)` calculates the arithmetic mean for delivered orders.",
    "code": "SELECT COUNT(*) AS total_orders, SUM(total_amount) AS gross_revenue, ROUND(AVG(total_amount), 2) AS avg_order_value FROM orders WHERE status = 'DELIVERED';",
    "followUp": {
      "question": "What is the difference between COUNT(*) and COUNT(column_name)?",
      "expectedAnswer": "COUNT(*) counts all rows in the group regardless of contents, including rows where some columns are NULL. COUNT(column_name) counts only rows where the specified column is NOT NULL."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Applies correct aggregate functions",
      "Filters for DELIVERED status",
      "Aliases output columns cleanly"
    ]
  },
  "expectedConcepts": [
    "COUNT(*)",
    "SUM() aggregate",
    "AVG() aggregate",
    "ROUND() function",
    "Column aliases AS"
  ]
}
```
