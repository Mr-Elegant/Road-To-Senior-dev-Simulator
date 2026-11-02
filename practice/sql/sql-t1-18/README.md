# Second Normal Form (2NF) and Composite Keys

Collection: sql · ID: `sql-t1-18` · Mode: **guided**

## Business context

An order items table has a composite primary key (order_id, product_id). It also stores product_name and product_category in the same row.

## Task

Why does storing product_name in this composite-key table violate Second Normal Form (2NF)? Explain 2NF and partial dependencies.

## Follow-up questions

- Why do data warehouses deliberately violate 2NF and 3NF through denormalization?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
