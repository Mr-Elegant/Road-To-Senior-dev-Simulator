# Reference: SQL Data Types: VARCHAR, CHAR, and TEXT in PostgreSQL

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "1. CHAR(n) is fixed-length, right-padded with spaces to length n. It wastes storage and requires trim operations. 2. VARCHAR(n) is variable-length with a maximum length check of n characters. 3. TEXT is variable-length with unlimited storage (up to 1GB). In PostgreSQL, there is ZERO performance difference between VARCHAR and TEXT. Under the hood, both use the exact same `varlena` storage structure. The only difference is that VARCHAR(n) incurs a slight CPU check to enforce length limit n.",
    "followUp": {
      "question": "Why should CHAR(n) be avoided in almost all modern PostgreSQL schemas?",
      "expectedAnswer": "CHAR(n) pads trailing spaces which must be stripped in comparisons, causes unexpected string length behaviors, and provides zero performance or storage benefits over VARCHAR or TEXT in PostgreSQL."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Compares the three types",
      "Explains PostgreSQL internal storage equality",
      "Mentions length check overhead"
    ]
  },
  "expectedConcepts": [
    "Fixed-length vs variable-length",
    "Space-padding in CHAR",
    "PostgreSQL varlena storage equality between VARCHAR and TEXT"
  ]
}
```
