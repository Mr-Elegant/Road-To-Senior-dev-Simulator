# Window Frame Specifications: ROWS vs RANGE vs GROUPS

Collection: sql · ID: `sql-tier3-015` · Mode: **sql**

## Business context

A financial risk officer needs a 3-day rolling sum of repayments per borrower to detect repayment surges. Because multiple repayments occur on the same day, using `ROWS BETWEEN` produces different totals depending on arbitrary row sorting.

## Task

Explain the difference between `ROWS`, `RANGE`, and `GROUPS` framing modes in SQL window functions. Write a query against `repayments` that calculates both a 2-row physical moving average (`ROWS`) and a calendar-date-based rolling 3-day sum (`RANGE`) per loan.

## Follow-up questions

- Why can `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` cause significant performance degradation compared to `ROWS`?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/window-frame-specifications-rows-vs-range-vs-groups--sql-tier3-015
npm run practice:watch -- sql/window-frame-specifications-rows-vs-range-vs-groups--sql-tier3-015
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
