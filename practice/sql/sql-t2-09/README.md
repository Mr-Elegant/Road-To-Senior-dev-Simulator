# Combining Result Sets with UNION and UNION ALL

Collection: sql · ID: `sql-t2-09` · Mode: **sql**

## Business context

The audit team needs a consolidated feed of credit activity: both loan disbursements and EMI repayments in a single chronological stream.

## Task

Write a query combining `type`, `amount`, and `created_at` from `transactions` where `type = 'DISBURSEMENT'` with transactions where `type = 'EMI_REPAYMENT'` using `UNION ALL`. Order the combined results by `created_at` ascending.

## Follow-up questions

- Why should UNION ALL be preferred over UNION unless deduplication is explicitly required?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/sql-t2-09
npm run practice:watch -- sql/sql-t2-09
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
