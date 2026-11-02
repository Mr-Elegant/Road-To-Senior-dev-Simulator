# Top 2 Revenue Products Per Category (Window Functions)

Collection: coding · ID: `sql-top-n-per-category` · Mode: **practice-sql** · Dialect: **postgresql**

## Task

An e-commerce marketplace needs to identify the top 2 highest-grossing products in every category.
In the event of identical revenues, both products should receive the same rank without skipping rank numbers (`DENSE_RANK`).

Database Tables:
1. `categories` (id INT, name VARCHAR)
2. `products` (id INT, category_id INT, title VARCHAR, revenue INT)

Output Requirements:
Return columns:
- `category_name`: Name of the product category
- `product_title`: Title of the product
- `revenue`: Product revenue
- `ranking`: The dense rank (1 or 2) within that category
Order by `category_name` ASC, `ranking` ASC, `revenue` DESC.

## Constraints

- Must use SQL Window function DENSE_RANK() OVER (PARTITION BY ... ORDER BY ...).
- Filter output to ranking <= 2.

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- coding/sql-top-n-per-category
npm run practice:watch -- coding/sql-top-n-per-category
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
