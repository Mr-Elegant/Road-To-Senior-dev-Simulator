# EXPLAIN (ANALYZE, BUFFERS): Plan Reading & Scan Types

Collection: sql · ID: `sql-tier3-002` · Mode: **guided**

## Business context

A dashboard query filtering `orders` by `customer_id` and `status` takes 1.8 seconds in staging. The developer ran `EXPLAIN (ANALYZE, BUFFERS)` and asks you to interpret the output.

## Task

Analyze the four primary scan types in PostgreSQL: Sequential Scan, Index Scan, Index Only Scan, and Bitmap Index Scan. Under what exact conditions does the planner choose a Bitmap Index Scan over a normal Index Scan? What do `Buffers: shared hit, read, dirtied` signify?

## Follow-up questions

- If EXPLAIN shows `Lossy Bitmap Heap Scan`, what configuration parameter was exceeded, and what is the performance impact?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
