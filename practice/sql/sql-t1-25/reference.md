# Reference: Database Constraints: NOT NULL, UNIQUE, and CHECK

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "```sql\nCREATE TABLE loan_products (\n  id SERIAL PRIMARY KEY,\n  product_code VARCHAR(20) NOT NULL UNIQUE,\n  interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate > 0 AND interest_rate < 50),\n  min_credit_score INT CHECK (min_credit_score >= 300 AND min_credit_score <= 900)\n);\n```\n- `NOT NULL` prevents missing values.\n- `UNIQUE` prevents duplicates (PostgreSQL creates an underlying B-Tree index to enforce uniqueness).\n- `CHECK` enforces arbitrary boolean domain rules on column values.",
    "followUp": {
      "question": "How do UNIQUE constraints handle NULL values in standard SQL vs PostgreSQL?",
      "expectedAnswer": "In SQL standard and PostgreSQL by default, NULL != NULL. Thus, multiple rows with NULL in a UNIQUE column are permitted. PostgreSQL 15 introduced UNIQUE NULLS NOT DISTINCT to treat NULLs as equal duplicates."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Defines NOT NULL, UNIQUE, CHECK",
      "Provides clear DDL example"
    ]
  },
  "expectedConcepts": [
    "NOT NULL data integrity",
    "UNIQUE constraint and implicit B-Tree",
    "CHECK constraint boolean expression"
  ]
}
```
