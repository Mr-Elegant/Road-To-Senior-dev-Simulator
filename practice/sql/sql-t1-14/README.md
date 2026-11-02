# Loan Approval Rates and Risk Categorization

Collection: sql · ID: `sql-t1-14` · Mode: **sql**

## Business context

Risk managers at ApexFin NBFC need a summary of loan application statuses grouped by purpose.

## Task

Write a query on `loan_applications` grouping by `purpose`, returning the `purpose`, `total_applications` (count of rows), and `total_amount_requested` (sum of requested_amount), ordered by `total_amount_requested` descending.

## Follow-up questions

- Why should financial figures always use numeric/decimal types rather than float/double in SQL?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-t1-14
npm run practice:watch -- sql/sql-t1-14
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
