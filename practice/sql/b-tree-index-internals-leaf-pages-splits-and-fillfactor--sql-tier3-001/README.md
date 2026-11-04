# B-Tree Index Internals: Leaf Pages, Splits, and Fillfactor

Collection: sql · ID: `sql-tier3-001` · Mode: **guided**

## Business context

A high-frequency payment processing service experiences periodic latency spikes (from 4ms to 450ms) during bursts of INSERT statements into the `payments` table. Investigation shows high disk I/O on index files.

## Task

Explain how PostgreSQL B-Tree indexes handle insertions. What is an index page split, why does it trigger 50/50 page allocations and random I/O, and how does the `fillfactor` storage parameter alleviate this for high-update/insert workloads?

## Follow-up questions

- Why does PostgreSQL 13+ B-Tree deduplication reduce index size for non-unique columns, and when is it disabled?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
