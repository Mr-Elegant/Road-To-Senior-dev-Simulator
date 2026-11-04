# Database Normalization vs. Denormalization Trade-offs

Collection: sql · ID: `sql-t2-15` · Mode: **guided**

## Business context

An e-commerce order checkout endpoint calculates total order price by joining orders, order_items, discounts, and tax tables on every single page load.

## Task

Explain when denormalization (such as storing `total_amount` directly on the `orders` header) is justified. What risks does denormalization introduce, and how are they mitigated?

## Follow-up questions

- What is a Generated Column in PostgreSQL and how does it support safe denormalization?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
