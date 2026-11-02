# Hierarchical Queries with Recursive CTEs (WITH RECURSIVE)

Collection: sql · ID: `sql-tier3-010` · Mode: **sql**

## Business context

Your product catalog supports deep nested product categories (e.g., Electronics -> Audio -> Headphones -> Wireless Headphones). You need to generate the full breadcrumb path and depth level for every category.

## Task

Write a query using a recursive Common Table Expression (`WITH RECURSIVE`) against a hierarchical table of categories (`id`, `parent_id`, `name`) that calculates the complete ancestor path (`breadcrumb`) and hierarchical depth level for each category, ordered by path.

## Follow-up questions

- How do you prevent infinite recursion in a recursive CTE if the data contains a cyclic graph (e.g., node A is parent of B, B is parent of A)?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-tier3-010
npm run practice:watch -- sql/sql-tier3-010
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
