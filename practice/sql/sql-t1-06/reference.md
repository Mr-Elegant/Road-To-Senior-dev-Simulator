# Reference: Membership Filtering with the IN Operator

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`WHERE status IN ('PAID', 'SHIPPED')` concisely matches any row whose status matches either literal in the set, avoiding verbose `OR` chains.",
    "code": "SELECT id, status, total_amount FROM orders WHERE status IN ('PAID', 'SHIPPED') ORDER BY id ASC;",
    "followUp": {
      "question": "What is the danger of using NOT IN with a subquery containing NULL values?",
      "expectedAnswer": "If any row in the subquery result is NULL, NOT IN evaluates to UNKNOWN for all rows, resulting in an empty set. NOT EXISTS or IN with IS NOT NULL should be used instead."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Includes PAID and SHIPPED",
      "Excludes DELIVERED and PENDING"
    ]
  },
  "expectedConcepts": [
    "IN operator",
    "Set membership",
    "Status lifecycle"
  ]
}
```
