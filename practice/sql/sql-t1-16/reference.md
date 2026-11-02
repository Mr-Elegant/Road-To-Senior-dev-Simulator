# Reference: Relational Database Keys: Primary Keys vs. Foreign Keys

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A Primary Key uniquely identifies each row in a table. It must contain unique, non-null values (enforcing entity integrity). A Foreign Key is a column (or set of columns) in one table that references the Primary Key of another table. It enforces Referential Integrity: the database engine guarantees that a child row cannot reference a non-existent parent row, preventing orphaned data. The database also governs cascading behaviors on delete or update (e.g. ON DELETE CASCADE or ON DELETE RESTRICT).",
    "followUp": {
      "question": "What is the risk of disabling foreign key constraints in high-throughput microservices?",
      "expectedAnswer": "Disabling foreign keys risks data corruption and orphaned records if network drops or bugs occur between microservice writes. While it reduces write overhead, the burden of maintaining referential integrity shifts entirely to application code."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Defines PK constraints",
      "Defines FK constraints",
      "Explains Referential Integrity"
    ]
  },
  "expectedConcepts": [
    "Primary Key uniqueness and NOT NULL constraint",
    "Foreign Key child-to-parent reference",
    "Referential Integrity",
    "Prevention of orphaned records"
  ]
}
```
