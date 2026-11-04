# Reference: PostgreSQL Join Strategies: Nested Loop, Hash Join, and Merge Join

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Nested Loop Join:**\n- **Mechanism**: For each outer row, scans the inner relation looking for matching rows.\n- **Indexed Nested Loop**: If the inner relation has an index on the join key, lookup cost is $O(M \\cdot \\log N)$. Ideal when the outer relation has very few rows (e.g. 1 to 500 rows) filtered by a selective WHERE clause.\n- **Non-Indexed Nested Loop**: $O(M \\cdot N)$ cartesian scan; disastrous for large tables.\n\n**2. Hash Join:**\n- **Mechanism**: Reads the entire inner (smaller) relation into an in-memory hash table in `work_mem` using a hash function on the join key. Then sequentially scans the outer relation, probing the hash table for matches.\n- **Complexity**: $O(M + N)$ linear time. Ideal for large, unsorted datasets with equality join predicates (`=`).\n- **Memory & Batching**: If the hash table exceeds `work_mem`, Postgres switches to a multi-batch Hash Join (spilling partition buckets to disk via temporary files), causing significant disk I/O.\n\n**3. Merge Join:**\n- **Mechanism**: Requires both relations to be pre-sorted on the join keys. Two cursors advance in parallel down both inputs simultaneously like a zip.\n- **Complexity**: $O(M + N)$ scan time after sorting. Ideal when inputs are already sorted (e.g. from B-tree index scans or explicit ORDER BY) or when join condition involves inequality operators with sorting.",
    "followUp": {
      "question": "Why would the query planner choose a Nested Loop over a Hash Join even when joining a 1-million row table, and how can stale statistics cause a disastrous plan regression here?",
      "expectedAnswer": "If stale statistics cause the planner to underestimate the outer relation’s row count (e.g., predicting 1 row when 200,000 actually match), it chooses an Indexed Nested Loop because 1 index seek is cheaper than building a hash table. In reality, executing 200,000 random index seeks takes minutes instead of milliseconds. Running `ANALYZE` updates table statistics and restores the Hash Join."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Describes inner/outer mechanics of all three join types",
      "Explains memory and work_mem spilling in Hash Join",
      "Identifies pre-sorted requirement for Merge Join",
      "Explains how cardinality misestimation triggers bad Nested Loop plans"
    ]
  },
  "expectedConcepts": [
    "Nested loop optimal for tiny outer set + indexed inner lookup",
    "Hash join builds hash table in work_mem and probes with outer scan",
    "Multi-batch hash join spilling to disk when exceeding work_mem",
    "Merge join requires pre-sorted inputs (B-tree or explicit sort)",
    "Time complexity comparison across all three"
  ]
}
```
