# Reference: Third Normal Form (3NF) and Transitive Dependencies

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A table is in 3NF if it is in 2NF and contains no transitive dependencies: non-key attributes must depend directly on the primary key, and nothing else (the classic rule: \"Every attribute must depend on the key, the whole key, and nothing but the key, so help me Codd\"). Here, `emp_id -> dept_id` and `dept_id -> dept_manager_name`. Thus, `dept_manager_name` depends on `emp_id` transitively via `dept_id`. If the department manager changes, multiple employee rows must be modified. Normalizing into a `departments` table eliminates the anomaly.",
    "followUp": {
      "question": "What is Boyce-Codd Normal Form (BCNF) and when does it diverge from 3NF?",
      "expectedAnswer": "BCNF is a stricter version of 3NF addressing tables with multiple overlapping composite candidate keys. In BCNF, every determinant (attribute on which another attribute depends) must be a superkey."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Defines 3NF",
      "Explains transitive dependency",
      "Provides resolution"
    ]
  },
  "expectedConcepts": [
    "Must be in 2NF",
    "No transitive dependencies",
    "Non-key column depending on another non-key column",
    "Normalization into departments table"
  ]
}
```
