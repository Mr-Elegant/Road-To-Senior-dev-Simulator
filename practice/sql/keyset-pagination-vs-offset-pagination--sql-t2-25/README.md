# Keyset Pagination vs. OFFSET Pagination

Collection: sql · ID: `sql-t2-25` · Mode: **guided**

## Business context

A mobile app user scrolls through infinite search results: `SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 500000;`. The API response time degrades from 15ms on page 1 to 4.2 seconds on page 25,000.

## Task

Why does OFFSET pagination degrade linearly with high offsets? How does Keyset Pagination (Cursor Pagination) solve this with O(1) performance?

## Follow-up questions

- What is the main user experience limitation of Keyset Pagination compared to OFFSET pagination?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
