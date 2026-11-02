# Reference: First Normal Form (1NF) Fundamentals

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "This violates First Normal Form (1NF). 1NF requires: 1. Every column must contain atomic (indivisible) values—no repeating groups, arrays, or comma-delimited strings. 2. Each record must have a unique identifier (Primary Key). To refactor: Create a dedicated child table `customer_phones (id, customer_id, phone_number, phone_type)`, establishing a 1-to-many relationship where each phone number occupies its own row with a foreign key referencing `customers.id`.",
    "followUp": {
      "question": "When might storing non-atomic data like a JSON array be acceptable in modern PostgreSQL?",
      "expectedAnswer": "PostgreSQL JSONB is acceptable for semi-structured data, dynamic third-party payloads, or sparse attributes that vary widely per row and do not require relational foreign key constraints."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains atomicity in 1NF",
      "Identifies the problem with comma-separated strings",
      "Provides clean child-table schema"
    ]
  },
  "expectedConcepts": [
    "Atomic values",
    "No repeating groups or comma-separated lists",
    "1-to-many child table refactoring"
  ]
}
```
