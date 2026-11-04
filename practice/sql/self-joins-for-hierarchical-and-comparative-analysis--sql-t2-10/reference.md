# Reference: Self-Joins for Hierarchical and Comparative Analysis

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "```sql\nSELECT\n  e.name AS employee_name,\n  m.name AS manager_name\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;\n```\nA Self-Join joins a table to itself using two distinct table aliases (`e` for employee, `m` for manager). A `LEFT JOIN` is essential because the CEO or top executives have `manager_id IS NULL`. An `INNER JOIN` would drop the CEO from the report.",
    "followUp": {
      "question": "How do you query arbitrary-depth organizational hierarchies (e.g. employee -> manager -> VP -> CEO) in PostgreSQL?",
      "expectedAnswer": "Using a Recursive Common Table Expression (WITH RECURSIVE org_tree AS ...), which defines an anchor member for root nodes and a recursive member joining the CTE back to the employees table until termination."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Defines self-join",
      "Provides correct SQL syntax",
      "Explains why LEFT JOIN preserves root executives"
    ]
  },
  "expectedConcepts": [
    "Self-join with table aliases",
    "Hierarchical adjacency list pattern",
    "LEFT JOIN necessity for root nodes (NULL manager_id)"
  ]
}
```
