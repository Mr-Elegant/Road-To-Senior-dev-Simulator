# Reference: Basic Column Projection and Row Limiting

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "The `SELECT` statement specifies the columns `name`, `category`, and `price`. `FROM products` targets the table. `ORDER BY name ASC` sorts results alphabetically by name, and `LIMIT 5` restricts the output to 5 rows.",
    "code": "SELECT name, category, price FROM products ORDER BY name ASC LIMIT 5;",
    "followUp": {
      "question": "What happens if you omit the ORDER BY clause when using LIMIT in a relational database?",
      "expectedAnswer": "Without an ORDER BY clause, SQL tables have no guaranteed order. The database engine may return any arbitrary 5 rows depending on storage layout or execution plan, making pagination non-deterministic."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Selects only the three requested columns",
      "Sorts alphabetically by product name",
      "Restricts output to exactly 5 rows"
    ]
  },
  "expectedConcepts": [
    "SELECT clause",
    "FROM clause",
    "ORDER BY ASC",
    "LIMIT clause"
  ]
}
```
