# Ranking Products Within Categories Using DENSE_RANK()

Collection: sql · ID: `sql-t2-04` · Mode: **sql**

## Business context

Merchandising wants to display product rank within each category from most expensive to least expensive.

## Task

Write a query to rank products within each `category` based on `price` descending. Return `category`, `name`, `price`, and `category_price_rank` using `DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC)`. Order final results by `category` ascending, then `category_price_rank` ascending.

## Follow-up questions

- What is the exact behavioral difference between ROW_NUMBER(), RANK(), and DENSE_RANK() on tied values (e.g., $100, $100, $80)?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/ranking-products-within-categories-using-dense-rank--sql-t2-04
npm run practice:watch -- sql/ranking-products-within-categories-using-dense-rank--sql-t2-04
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
