# PostgreSQL JSONB: Operators, jsonb_path_query, and GIN Indexing

Collection: sql · ID: `sql-tier3-007` · Mode: **guided**

## Business context

Your e-commerce product catalog stores dynamic technical specifications in a `specifications JSONB` column. Queries searching for products with `"ram_gb" >= 16` and `"color" IN ("space_gray", "silver")` are performing full table scans.

## Task

Compare JSON vs JSONB in PostgreSQL. Explain the core operators (`->`, `->>`, `@>`, `?`, `@@`). Write a query using PostgreSQL SQL/JSON path syntax (`jsonb_path_query` or `jsonb_path_match`) and specify the exact GIN index required to index deep key-value lookups efficiently.

## Follow-up questions

- Why does `CREATE INDEX ON products USING gin ((specifications->>'brand'))` fail, and what should be used instead?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
