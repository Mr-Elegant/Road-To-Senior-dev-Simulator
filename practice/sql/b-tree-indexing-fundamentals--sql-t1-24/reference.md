# Reference: B-Tree Indexing Fundamentals

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Without an index, the database performs a sequential scan (Seq Scan), reading every block from disk and checking all 2M rows (O(N) complexity). A B-Tree index creates a balanced hierarchical tree of sorted values and block pointers. Finding a value requires traversing from root to leaf in O(log N) steps (typically 3–4 I/O reads). The trade-off: every INSERT, UPDATE, and DELETE must also update the B-Tree structure and write to disk, adding write latency and consuming storage.",
    "followUp": {
      "question": "Why does creating an index on a boolean column (e.g. is_active) often provide little to no benefit?",
      "expectedAnswer": "Low selectivity. When a column has only two values (true/false) and one value accounts for 50%+ of rows, the planner finds it cheaper to scan the table sequentially than jumping between the index and data pages."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains Seq Scan vs Index Scan",
      "Mentions O(log N) tree traversal",
      "Mentions write overhead"
    ]
  },
  "expectedConcepts": [
    "Sequential Scan O(N)",
    "B-Tree hierarchical lookup O(log N)",
    "Pointer to disk tuple (TID)",
    "Write overhead on INSERT/UPDATE/DELETE"
  ]
}
```
