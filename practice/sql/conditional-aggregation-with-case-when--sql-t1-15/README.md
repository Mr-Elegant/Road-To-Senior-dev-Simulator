# Conditional Aggregation with CASE WHEN

Collection: sql · ID: `sql-t1-15` · Mode: **sql**

## Business context

Credit risk officers need to count how many loans are in good standing versus overdue across EMI installments.

## Task

Write a query on `emi_schedule` to calculate the total count of installments (`total_emis`), count of paid installments (`paid_count`), and count of overdue installments (`overdue_count`) using `CASE WHEN`.

## Follow-up questions

- How does PostgreSQL's native FILTER (WHERE condition) clause simplify conditional aggregation?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/conditional-aggregation-with-case-when--sql-t1-15
npm run practice:watch -- sql/conditional-aggregation-with-case-when--sql-t1-15
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
