# Reference: Eliminating Duplicates with DISTINCT

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`SELECT DISTINCT category` deduplicates recurring categories across the product catalog. `ORDER BY category ASC` provides a clean alphabetical directory.",
    "code": "SELECT DISTINCT category FROM products ORDER BY category ASC;",
    "followUp": {
      "question": "What is the performance implication of applying DISTINCT on very large result sets?",
      "expectedAnswer": "DISTINCT requires the database engine to sort the rows or build an in-memory hash set to identify duplicates. On millions of rows, this can cause spill-to-disk (work_mem exhaustion) if not indexed."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Applies DISTINCT correctly",
      "Sorts alphabetically"
    ]
  },
  "expectedConcepts": [
    "DISTINCT keyword",
    "Deduplication",
    "ORDER BY"
  ]
}
```
