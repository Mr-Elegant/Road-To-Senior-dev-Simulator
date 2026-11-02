# Reference: Handling Missing Data with IS NULL and IS NOT NULL

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "In SQL, NULL signifies unknown or absent data. Testing equality with `= NULL` always evaluates to UNKNOWN. `IS NULL` is the mandatory syntax to check for missing values.",
    "code": "SELECT id, organization_id, amount, status FROM invoices WHERE paid_at IS NULL ORDER BY amount DESC;",
    "followUp": {
      "question": "Why does WHERE paid_at = NULL fail to return any rows?",
      "expectedAnswer": "In SQL three-valued logic, NULL represents an unknown value. Comparing anything to unknown yields UNKNOWN, never TRUE. A WHERE clause requires a boolean TRUE to include the row."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Uses IS NULL syntax correctly",
      "Orders by amount descending"
    ]
  },
  "expectedConcepts": [
    "IS NULL predicate",
    "Three-valued logic",
    "NULL comparison"
  ]
}
```
