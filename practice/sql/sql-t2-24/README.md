# PostgreSQL Autovacuum and Table Bloat

Collection: sql · ID: `sql-t2-24` · Mode: **guided**

## Business context

A high-frequency orders table receives 500,000 updates daily. Over two months, disk usage doubled even though the active row count remained constant at 1 million rows.

## Task

What causes Table Bloat in PostgreSQL? Explain what the VACUUM process does, and why VACUUM FULL should be used with extreme caution.

## Follow-up questions

- What open-source tool allows rebuilding a bloated PostgreSQL table online without taking an exclusive lock?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
