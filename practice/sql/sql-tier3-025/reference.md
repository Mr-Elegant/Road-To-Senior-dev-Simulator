# Reference: Partial Indexes and Expression Indexes: Advanced Query Optimization

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Partial Indexes:**\n- A partial index includes an index predicate (`WHERE ...`). It only indexes rows that satisfy the predicate.\n- If 97% of rows are `DELIVERED`, a partial index on `status IN ('FAILED', 'PENDING')` indexes only 3% of the table.\n- **Benefits**: 97% smaller index size, stays completely inside `shared_buffers` memory, and writes to `DELIVERED` orders generate **zero** index maintenance overhead.\n\n**2. Expression (Functional) Indexes:**\n- Normal B-tree indexes store raw column values. If a query applies a function (e.g. `WHERE lower(email) = ...`), a standard index on `email` **cannot be used** because the index keys do not match the function output.\n- An expression index computes and stores the evaluated result of the expression directly in the index leaf pages.\n\n**3. Creation and Query Match:**\n```sql\n-- Index definition:\nCREATE INDEX idx_orders_unresolved ON orders (lower(customer_email))\nWHERE status IN ('FAILED', 'PENDING');\n\n-- Query matching both expression and predicate:\nSELECT id, customer_email, total_amount, status\nFROM orders\nWHERE lower(customer_email) = 'alice@example.com'\n  AND status = 'PENDING';\n```\nThe query planner recognizes that `status = 'PENDING'` implies `status IN ('FAILED', 'PENDING')` and utilizes the index.",
    "code": "-- 1. Create partial expression index\nCREATE INDEX idx_orders_unresolved ON orders (lower(customer_email))\nWHERE status IN ('FAILED', 'PENDING');\n\n-- 2. Query that matches index condition and expression\nSELECT id, customer_email, total_amount, status\nFROM orders\nWHERE lower(customer_email) = 'alice@example.com'\n  AND status = 'PENDING';",
    "followUp": {
      "question": "If a query runs `WHERE lower(customer_email) = 'alice@example.com'` without specifying `status`, will PostgreSQL use this partial index?",
      "expectedAnswer": "No. PostgreSQL will refuse to use the partial index because the query could match rows where status is `DELIVERED` or `REFUNDED`, which do not exist in the partial index. The query predicate must mathematically imply the index predicate for the planner to consider it."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 25,
    "performanceWeight": 20,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains partial index predicate mechanics and storage savings",
      "Explains expression index function value storage",
      "Provides correct DDL combining expression and partial predicate",
      "Explains why queries must satisfy index predicate to use it"
    ]
  },
  "expectedConcepts": [
    "Partial index predicate filtering rows at index creation time",
    "Expression index evaluating and storing function outputs",
    "Index size reduction and write overhead elimination for excluded rows",
    "Planner requirement that query WHERE clause subsume the index predicate"
  ]
}
```
