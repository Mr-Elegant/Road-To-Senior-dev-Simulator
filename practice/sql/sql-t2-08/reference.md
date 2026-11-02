# Reference: FULL OUTER JOIN for Data Reconciliation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`FULL OUTER JOIN` produces the complete union of matched rows, unmatched left rows (orders without payments), and unmatched right rows (payments without orders), filling missing values with NULLs.",
    "code": "SELECT o.id AS order_id, p.id AS payment_id, o.total_amount, p.amount AS payment_amount FROM orders o FULL OUTER JOIN payments p ON o.id = p.order_id ORDER BY o.id ASC, p.id ASC;",
    "followUp": {
      "question": "Under what conditions will an order appear with payment_id = NULL in this query?",
      "expectedAnswer": "When an order has been created but no payment row has been recorded in the payments table (e.g., an in-flight cart or cash-on-delivery pending settlement)."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Proper FULL OUTER JOIN",
      "Aliases order_id and payment_id",
      "Preserves unmatched rows"
    ]
  },
  "expectedConcepts": [
    "FULL OUTER JOIN",
    "Reconciliation audit pattern",
    "Bilateral outer join semantics"
  ]
}
```
