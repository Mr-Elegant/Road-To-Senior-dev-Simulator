# Reference: Surrogate Keys vs. Natural Keys

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A Natural Key is a real-world attribute that is already unique (e.g. SSN, email, PAN). A Surrogate Key is a database-generated synthetic identifier with no business meaning (e.g. BIGSERIAL, UUIDv4). Risks of Natural Keys: 1. Business rules change (e.g. government re-issues numbers or allows updates; updating a PK cascade-updates millions of foreign keys). 2. Security and compliance (SSNs leaked in URLs, foreign key logs, or API responses). 3. Performance (wide string natural keys bloat secondary B-Tree indexes). Best practice: Use a surrogate key as PK, and place a UNIQUE constraint on the natural key.",
    "followUp": {
      "question": "When is a Natural Key appropriate in database modeling?",
      "expectedAnswer": "Natural keys are appropriate for immutable reference tables with universally standardized codes that never change, such as ISO 3166 country codes (e.g. 'US', 'GB', 'IN') or ISO 4217 currency codes ('USD', 'EUR')."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Compares both key types",
      "Explains cascading update risk",
      "Identifies PII security risk"
    ]
  },
  "expectedConcepts": [
    "Natural key vs Surrogate key definition",
    "Cascading update vulnerability of natural keys",
    "PII exposure risks in foreign key relationships",
    "Index storage bloat of string keys"
  ]
}
```
