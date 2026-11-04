# Handling Missing Data with IS NULL and IS NOT NULL

Collection: sql · ID: `sql-t1-07` · Mode: **sql**

## Business context

Finance accounts receivable needs to audit unpaid invoices requiring payment collection.

## Task

Write a query from the `invoices` table to retrieve `id`, `organization_id`, `amount`, and `status` for all invoices where `paid_at IS NULL`, ordered by `amount` descending.

## Follow-up questions

- Why does WHERE paid_at = NULL fail to return any rows?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/handling-missing-data-with-is-null-and-is-not-null--sql-t1-07
npm run practice:watch -- sql/handling-missing-data-with-is-null-and-is-not-null--sql-t1-07
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
