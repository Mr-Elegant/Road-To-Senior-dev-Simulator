# Reference: Pattern Matching with LIKE and Wildcards

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`LIKE '%@example.com'` matches any character sequence followed by `@example.com`. In standard SQL, `%` represents zero or more characters.",
    "code": "SELECT id, name, email FROM customers WHERE email LIKE '%@example.com' ORDER BY id ASC;",
    "followUp": {
      "question": "In PostgreSQL, what is the difference between LIKE and ILIKE?",
      "expectedAnswer": "LIKE is case-sensitive, meaning 'abc' LIKE '%ABC' evaluates to false. ILIKE is a PostgreSQL-specific extension that performs case-insensitive pattern matching."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Correct pattern match syntax",
      "Preserves case matching",
      "Ordered by id"
    ]
  },
  "expectedConcepts": [
    "LIKE operator",
    "Percent wildcard %",
    "String filtering"
  ]
}
```
