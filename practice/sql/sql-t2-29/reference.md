# Reference: Soft Deletes vs. Hard Deletes: Architecture and Query Traps

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Advantages: Accidental deletion recovery, historical audit retention, referential integrity preservation.\nQuery Traps & Complications:\n1. Developer trap: Every query, join, and count across the codebase must remember `WHERE is_deleted = false`. Forgetting this leaks deleted users or inflates financial totals.\n2. UNIQUE constraint break: If `email` has a UNIQUE constraint and a user deletes their account, they cannot re-register with that email unless a partial unique index is used: `CREATE UNIQUE INDEX idx_users_active_email ON users (email) WHERE is_deleted = false;`.\n3. Index bloat: Indexes continue indexing dead rows unless partial indexes are used.",
    "followUp": {
      "question": "What is a cleaner alternative to soft delete columns for tables that must maintain strict relational constraints?",
      "expectedAnswer": "Move deleted records to a dedicated archive table (e.g. users_archive) using a DELETE ... RETURNING trigger. The active table remains small, fast, and unpolluted with deleted flags, and standard UNIQUE constraints work naturally."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains soft delete benefits",
      "Identifies unique constraint break",
      "Provides partial unique index solution"
    ]
  },
  "expectedConcepts": [
    "Soft delete definition and audit advantages",
    "Leaked deleted records in un-filtered queries",
    "Unique constraint collisions upon re-registration",
    "Partial unique index resolution"
  ]
}
```
