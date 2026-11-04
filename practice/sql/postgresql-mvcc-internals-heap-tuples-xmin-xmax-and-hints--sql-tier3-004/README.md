# PostgreSQL MVCC Internals: Heap Tuples, xmin, xmax, and Hints

Collection: sql · ID: `sql-tier3-004` · Mode: **guided**

## Business context

During an audit of the `loans` table, a junior engineer notices that after running an `UPDATE loans SET status = 'ACTIVE'` on 10,000 rows, the table size on disk doubled from 50MB to 100MB even though the row count remained identical.

## Task

Explain PostgreSQL Multi-Version Concurrency Control (MVCC) at the physical tuple level. What are `xmin`, `xmax`, `t_ctid`, and `infomask` hint bits in the heap tuple header? Describe step-by-step how an UPDATE statement is executed physically on disk.

## Follow-up questions

- What are "hint bits" in the tuple header, and why does a pure read query (SELECT) sometimes dirty heap pages on disk?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
