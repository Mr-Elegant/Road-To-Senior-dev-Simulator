# Array Data Types and High-Performance Containment Queries

Collection: sql · ID: `sql-tier3-027` · Mode: **sql**

## Business context

A tagging system for products stores assigned tags in a `VARCHAR[]` array column (e.g. `{'electronics', 'sale', 'audio'}`). You need to find products that contain specific combinations of tags without maintaining a join table.

## Task

Explain PostgreSQL array data types, array operators (`@>` contains, `<@` is contained by, `&&` overlaps), and how to index arrays using GIN. Write a query against `products` that finds all products having both `'wireless'` and `'audio'` in their tags array, and projects the total tag count using `cardinality()`.

## Follow-up questions

- When is storing data in an array column an anti-pattern compared to a standard normalized junction table (`product_tags`)?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/array-data-types-and-high-performance-containment-queries--sql-tier3-027
npm run practice:watch -- sql/array-data-types-and-high-performance-containment-queries--sql-tier3-027
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
