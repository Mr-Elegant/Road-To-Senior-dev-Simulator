# Reference: CTEs in PostgreSQL 12+: MATERIALIZED vs NOT MATERIALIZED

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Pre-PostgreSQL 12 Behavior (The Optimization Fence):**\n- Prior to PG 12, all CTEs (`WITH cte AS (...)`) were treated as strict **optimization fences**.\n- PostgreSQL always evaluated the CTE independently, materialized the entire intermediate result into temporary memory or disk, and blocked the planner from pushing outer WHERE predicates or join conditions down into the CTE.\n- This often resulted in slow plans where a CTE computed 100,000 rows only for the outer query to filter it down to 10 rows.\n\n**2. PostgreSQL 12+ Inlining (NOT MATERIALIZED by default):**\n- Starting in PG 12, if a CTE is non-recursive, does not contain side-effects (e.g. `INSERT/UPDATE/DELETE`), and is referenced only once in the outer query, PostgreSQL **inlines** the CTE directly into the main query tree (treating it like a subquery in `FROM`).\n- Outer filters and join conditions are pushed down, allowing index scans and optimal join orders.\n\n**3. Explicit Control Clauses:**\n- `WITH cte AS MATERIALIZED (...)`: Forces PostgreSQL to evaluate the CTE once and store the result in memory, acting as an optimization fence. Useful when the CTE is expensive and referenced multiple times, or to force a specific execution order to prevent division-by-zero errors.\n- `WITH cte AS NOT MATERIALIZED (...)`: Forces PostgreSQL to inline the CTE even if it is referenced multiple times in the query, allowing filters to be pushed into each usage.",
    "followUp": {
      "question": "When is forcing `AS MATERIALIZED` beneficial in modern PostgreSQL 14+?",
      "expectedAnswer": "Forcing `AS MATERIALIZED` is beneficial when: (1) A complex, expensive CTE is referenced multiple times in the outer query, and inlining would cause Postgres to execute the expensive subquery multiple times; or (2) To prevent the planner from pushing down a condition that triggers an exception on rows that would otherwise have been excluded (acting as an intentional guard fence)."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains pre-PG12 optimization fence behavior",
      "Details PG12+ CTE inlining and predicate pushdown",
      "Contrasts AS MATERIALIZED vs AS NOT MATERIALIZED syntax",
      "Identifies use cases where materialization fence is desirable"
    ]
  },
  "expectedConcepts": [
    "Pre-PG12 optimization fence behavior and forced materialization",
    "PG12+ automatic CTE inlining when referenced once without side-effects",
    "Predicate pushdown benefits of inlining",
    "WITH cte AS MATERIALIZED syntax to restore fence",
    "AS NOT MATERIALIZED to force inlining across multiple references"
  ]
}
```
