# Grouping and Aggregating with GROUP BY

Collection: sql · ID: `sql-t1-09` · Mode: **sql**

## Business context

Category managers need to analyze inventory depth by viewing product counts and average pricing per category.

## Task

Write a query to group products by `category`, returning the `category`, `product_count` (number of products), and `avg_price` (average price rounded to 2 decimals), sorted by `product_count` descending.

## Follow-up questions

- Why will a query fail if you include an unaggregated column in SELECT that is not listed in GROUP BY?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/grouping-and-aggregating-with-group-by--sql-t1-09
npm run practice:watch -- sql/grouping-and-aggregating-with-group-by--sql-t1-09
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
