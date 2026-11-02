# Reference: Partial Indexes in PostgreSQL

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "```sql\nCREATE INDEX idx_jobs_pending ON jobs (priority DESC) WHERE status = 'PENDING';\n```\nA Partial Index includes an index filter predicate (`WHERE condition`). Only rows satisfying the predicate are included in the B-Tree. Advantages:\n1. Storage: The index contains only 500 entries instead of 10,000,000, reducing index size by 99.9%.\n2. Memory: Fits easily in RAM (`shared_buffers`).\n3. Write performance: Inserts and updates to completed jobs never touch or dirty this index.",
    "followUp": {
      "question": "Will PostgreSQL use this partial index if a query executes: SELECT * FROM jobs WHERE status = 'COMPLETED'?",
      "expectedAnswer": "No. The index only contains rows where status = 'PENDING'. Queries filtering on other statuses or without the status predicate cannot use this index and will perform a sequential scan."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Valid partial index DDL",
      "Explains storage & memory reduction",
      "Explains write overhead reduction"
    ]
  },
  "expectedConcepts": [
    "Partial index with WHERE clause",
    "Drastic reduction in index size and disk footprint",
    "Zero write overhead for non-matching rows",
    "Cache efficiency in shared_buffers"
  ]
}
```
