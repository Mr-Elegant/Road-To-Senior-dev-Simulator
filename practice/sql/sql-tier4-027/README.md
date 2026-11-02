# Keyset Pagination vs Deep OFFSET: Eliminating O(N) Query Degradation

Collection: sql · ID: `sql-tier4-027` · Mode: **sql**

## Business context

A public product listing API allows customers to paginate through 1,000,000 products. Page 1 (`OFFSET 0 LIMIT 20`) loads in 1ms. Page 20,000 (`OFFSET 400000 LIMIT 20`) takes 8.5 seconds and causes severe database disk reads.

## Task

Explain why SQL `OFFSET` scales with $O(N)$ time complexity. Write an optimized keyset pagination query (seek method) using a composite cursor `(created_at, id)` that executes in $O(1)$ constant time regardless of page depth, and demonstrate the required composite B-tree index.

## Follow-up questions

- Why must the composite cursor include a unique tie-breaker column like `id` in addition to `created_at`?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-tier4-027
npm run practice:watch -- sql/sql-tier4-027
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
