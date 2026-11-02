# Reference: Understanding Database Views

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A VIEW is a saved named query (`CREATE VIEW customer_order_summary AS SELECT ...`). 1. It acts as a virtual table: querying the view executes the underlying query on the fly. 2. A standard view does NOT store data on disk and consumes zero row storage. 3. Advantages: Encapsulates complex joins into a clean interface; acts as a security boundary by exposing only allowed columns/rows to specific roles without granting direct table access.",
    "followUp": {
      "question": "What is the difference between a standard VIEW and a MATERIALIZED VIEW in PostgreSQL?",
      "expectedAnswer": "A standard view executes its query dynamically on every call and stores no data. A MATERIALIZED VIEW executes the query once and physically writes the result set to disk, enabling fast reads on expensive aggregations. It must be updated periodically with REFRESH MATERIALIZED VIEW."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Defines VIEW correctly",
      "Notes zero data storage",
      "Explains security/abstraction benefits"
    ]
  },
  "expectedConcepts": [
    "Virtual table definition",
    "Zero storage overhead for standard views",
    "Security boundary and simplification of complex joins"
  ]
}
```
