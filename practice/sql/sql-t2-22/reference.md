# Reference: Optimistic Locking with Version Columns

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Optimistic Locking assumes conflicts are rare and holds NO database locks during user think time. 1. Add a `version INT DEFAULT 1` column to the table. 2. When the user loads the edit form, fetch `id`, `name`, and `version` (e.g. version = 3). 3. When submitting changes, execute:\n```sql\nUPDATE customers\nSET name = 'New Name', version = version + 1\nWHERE id = 101 AND version = 3;\n```\n4. Check the database row count affected. If affected rows = 1, the update succeeded. If affected rows = 0, another user updated the record in the meantime; the application rejects the write and prompts the user to refresh and merge changes.",
    "followUp": {
      "question": "Compare Optimistic Locking and Pessimistic Locking in terms of suitability for high-conflict vs low-conflict workloads.",
      "expectedAnswer": "Pessimistic locking (SELECT FOR UPDATE) is best for high-conflict, short-duration transactions (e.g. flash-sale tickets, bank transfers). Optimistic locking is best for low-conflict or long-duration human workflows (e.g. web forms, CMS articles)."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Defines Optimistic Locking",
      "Shows SQL with version column",
      "Explains affected rows check"
    ]
  },
  "expectedConcepts": [
    "Optimistic vs Pessimistic locking",
    "Zero database lock holding during user think time",
    "Version column comparison in WHERE clause",
    "Affected rows verification (0 = conflict)"
  ]
}
```
