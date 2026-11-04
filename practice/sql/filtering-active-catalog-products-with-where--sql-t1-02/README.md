# Filtering Active Catalog Products with WHERE

Collection: sql · ID: `sql-t1-02` · Mode: **sql**

## Business context

Merchandising wants an active products list excluding discontinued or archived inventory.

## Task

Write a query to retrieve the `sku`, `name`, and `price` of all products from `products` where `is_active` is true and `price` is greater than 100.00, sorted by `price` descending.

## Follow-up questions

- How does SQL handle NULL values when evaluating a WHERE condition like price > 100?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/filtering-active-catalog-products-with-where--sql-t1-02
npm run practice:watch -- sql/filtering-active-catalog-products-with-where--sql-t1-02
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
