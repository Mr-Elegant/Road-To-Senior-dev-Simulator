# Reference: Foreign Key Cascade Behaviors: CASCADE, SET NULL, and RESTRICT

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "1. `ON DELETE CASCADE`: Deleting the parent automatically deletes all child rows. In financial systems, using CASCADE on orders when a customer is deleted is illegal (destroys audit logs, tax invoices, and accounting balance). 2. `ON DELETE SET NULL`: Sets the foreign key column in child rows to NULL while preserving the rows. Useful if order history must be retained without customer identity. 3. `ON DELETE RESTRICT` / `NO ACTION`: Aborts the delete operation with a foreign key violation error if child rows exist. In financial ledgers, RESTRICT is best practice: parent customer records must be soft-deleted (`is_archived = true`), never physically deleted.",
    "followUp": {
      "question": "What is the difference between RESTRICT and NO ACTION in PostgreSQL?",
      "expectedAnswer": "RESTRICT enforces the constraint immediately. NO ACTION permits deferred constraints (DEFERRABLE INITIALLY DEFERRED), checking the constraint only at the very end of the transaction, allowing intermediate statements to resolve the relationship."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Accurately describes all 3 behaviors",
      "Applies to financial audit compliance",
      "Recommends RESTRICT / soft-delete"
    ]
  },
  "expectedConcepts": [
    "ON DELETE CASCADE consequences",
    "ON DELETE SET NULL preservation",
    "ON DELETE RESTRICT audit protection",
    "Soft-delete patterns for compliance"
  ]
}
```
