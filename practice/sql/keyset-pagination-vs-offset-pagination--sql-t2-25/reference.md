# Reference: Keyset Pagination vs. OFFSET Pagination

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`OFFSET 500000 LIMIT 20` requires the database engine to physically read and process 500,020 rows, discard the first 500,000, and return only the last 20. This burns CPU and I/O (O(N) cost).\nKeyset Pagination uses the previous page's last row values as a cursor:\n```sql\nSELECT * FROM orders\nWHERE (created_at, id) < ('2024-03-01 10:00:00', 98412)\nORDER BY created_at DESC, id DESC\nLIMIT 20;\n```\nBecause `(created_at, id)` is indexed in a B-Tree, PostgreSQL jumps directly to the cursor position in O(log N) time and scans exactly 20 rows. Query execution remains 15ms whether on page 1 or page 100,000.",
    "followUp": {
      "question": "What is the main user experience limitation of Keyset Pagination compared to OFFSET pagination?",
      "expectedAnswer": "Keyset pagination does not allow jumping directly to an arbitrary page (e.g. \"Jump to Page 47\") or displaying total page count, making it ideal for infinite scroll but less suitable for traditional numeric pagination bars."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains why OFFSET reads and discards rows",
      "Demonstrates keyset SQL query",
      "Explains B-Tree index traversal"
    ]
  },
  "expectedConcepts": [
    "OFFSET linear degradation O(N)",
    "Keyset / Cursor pagination pattern",
    "B-Tree direct traversal O(log N)",
    "Consistent response time regardless of page depth"
  ]
}
```
