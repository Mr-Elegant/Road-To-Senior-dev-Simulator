# Monthly User Cohort Retention & Churn Analysis

Collection: coding · ID: `sql-monthly-cohort-retention` · Mode: **practice-sql** · Dialect: **generic-sql**

## Task

A subscription SaaS platform analyzes customer retention month-over-month.
Write a SQL query that calculates the active cohort user count for each cohort month (based on user signup date) and their recurring retention in subsequent months.

Database Tables:
1. `users` (id INT, email VARCHAR, signup_date DATE)
2. `activity` (id INT, user_id INT, activity_date DATE)

Output Requirements:
Return columns:
- `cohort_month`: The YYYY-MM formatted signup month of the cohort.
- `active_month`: The YYYY-MM formatted activity month.
- `retained_users`: Count of unique users from that cohort who performed an activity in that active month.
Order by `cohort_month` ASC, `active_month` ASC.

## Constraints

- Only count distinct users per active month.
- Format dates as YYYY-MM (e.g. `2026-01`).
- Filter out activity prior to user signup date.

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- coding/sql-monthly-cohort-retention
npm run practice:watch -- coding/sql-monthly-cohort-retention
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
