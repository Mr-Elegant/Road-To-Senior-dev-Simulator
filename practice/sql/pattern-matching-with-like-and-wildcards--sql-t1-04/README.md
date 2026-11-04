# Pattern Matching with LIKE and Wildcards

Collection: sql · ID: `sql-t1-04` · Mode: **sql**

## Business context

Customer support needs to find all customers registered with an @example.com email address.

## Task

Write a query to return the `id`, `name`, and `email` of all customers whose `email` ends with `@example.com`, ordered by `id` ascending.

## Follow-up questions

- In PostgreSQL, what is the difference between LIKE and ILIKE?

## Work locally

Edit [solution.sql](solution.sql) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- sql/pattern-matching-with-like-and-wildcards--sql-t1-04
npm run practice:watch -- sql/pattern-matching-with-like-and-wildcards--sql-t1-04
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
