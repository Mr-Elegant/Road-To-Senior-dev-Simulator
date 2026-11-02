# Reference: Expression / Functional Indexes in PostgreSQL

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A standard B-Tree index on `email` stores raw, un-transformed email strings sorted in binary character order. When a query executes `LOWER(email)`, the database engine cannot assume that the lowercase transform maps monotonically to the sorted tree, forcing a Sequential Scan to compute `LOWER()` on every row. An Expression Index (`CREATE INDEX idx_users_lower_email ON users (LOWER(email));`) pre-computes and stores the lowercase value in the B-Tree, allowing instant O(log N) lookups.",
    "followUp": {
      "question": "What requirement must a function satisfy to be used in a PostgreSQL expression index?",
      "expectedAnswer": "The function must be IMMUTABLE—it must always return the exact same output given the same input arguments (e.g. LOWER() is immutable; NOW() or RANDOM() are volatile and prohibited)."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains why standard index is bypassed",
      "Provides correct expression index syntax",
      "Mentions immutability requirement"
    ]
  },
  "expectedConcepts": [
    "Function wrapping prevents standard B-Tree index usage",
    "Expression index DDL syntax: CREATE INDEX ... ON table (FUNCTION(column))",
    "Pre-computation of function outputs in the index"
  ]
}
```
