# Reference: Composite and Foreign Key Indexing Basics

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A Composite Index is a single B-Tree index built on two or more columns (`CREATE INDEX idx_events_org_date ON events (organization_id, created_at);`). Column order matters: the index is sorted primarily by the first column, and secondarily by the second column. The best practice rule: place equality columns first (`organization_id`), followed by range/inequality columns (`created_at`). This allows PostgreSQL to jump directly to the organization's slice of the tree and scan only the date range.",
    "followUp": {
      "question": "Can the index ON events (organization_id, created_at) be used by a query filtering ONLY on created_at?",
      "expectedAnswer": "Generally no (or only via an inefficient Index Skip Scan). B-Trees require the leftmost prefix. Searching only on created_at without organization_id is like searching a phone book by first name without knowing the last name."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Defines composite index",
      "Correctly places equality column first",
      "Explains B-Tree traversal rationale"
    ]
  },
  "expectedConcepts": [
    "Composite index concept",
    "Column ordering rule (Equality first, range second)",
    "Leftmost prefix matching"
  ]
}
```
