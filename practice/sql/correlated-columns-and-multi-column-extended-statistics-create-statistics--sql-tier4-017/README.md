# Correlated Columns and Multi-Column Extended Statistics (CREATE STATISTICS)

Collection: sql · ID: `sql-tier4-017` · Mode: **guided**

## Business context

A query filtering `WHERE make = 'Audi' AND model = 'R8'` estimates that 1 row will match, but in reality 85,000 rows match. Because of this massive misestimation, PostgreSQL chooses a disastrous Nested Loop instead of a Hash Join, taking 45 seconds.

## Task

Explain how PostgreSQL computes selectivity for multi-column WHERE clauses by default. Why does the conditional independence assumption fail for correlated data? How does `CREATE STATISTICS` (dependencies, ndistinct, mcv) resolve multi-column cardinality estimation errors?

## Follow-up questions

- Does `CREATE STATISTICS` automatically gather statistics immediately upon execution?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
