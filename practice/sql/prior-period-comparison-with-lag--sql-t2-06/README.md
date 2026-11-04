# Prior Period Comparison with LAG()

Collection: sql · ID: `sql-t2-06` · Mode: **sql**

## Business context

Finance needs to calculate invoice-over-invoice growth and detect any billing discrepancies for organization 101.

## Task

Write a query on `invoices` for `organization_id = 101` returning `id`, `billing_date`, `amount`, and `prev_amount` (the amount of the immediately prior invoice using `LAG()`). Order results by `billing_date` ascending.

## Follow-up questions

- How do you provide a default fallback value if LAG() encounters the first row (instead of NULL)?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/prior-period-comparison-with-lag--sql-t2-06
npm run practice:watch -- sql/prior-period-comparison-with-lag--sql-t2-06
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
