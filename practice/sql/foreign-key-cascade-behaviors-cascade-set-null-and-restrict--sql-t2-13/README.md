# Foreign Key Cascade Behaviors: CASCADE, SET NULL, and RESTRICT

Collection: sql · ID: `sql-t2-13` · Mode: **guided**

## Business context

An e-commerce system is designing rules for what happens when a customer account is deleted: what should happen to their past orders and invoices?

## Task

Compare `ON DELETE CASCADE`, `ON DELETE SET NULL`, and `ON DELETE RESTRICT` (NO ACTION). What are the business and legal implications of each in e-commerce and financial ledgers?

## Follow-up questions

- What is the difference between RESTRICT and NO ACTION in PostgreSQL?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
