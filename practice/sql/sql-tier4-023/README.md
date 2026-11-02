# Heap-Only Tuple (HOT) Optimization Failures and Write Amplification

Collection: sql · ID: `sql-tier4-023` · Mode: **guided**

## Business context

An application updates a `last_seen_at` timestamp on `users` on every API request. Although the table only has 1 million rows, disk write I/O is 80 MB/sec and index size is growing by 5 GB per day. Telemetry shows HOT update ratio is 0%.

## Task

Explain PostgreSQL Heap-Only Tuple (HOT) optimization. What are the two mandatory conditions required for an UPDATE to qualify as a HOT update? Why does indexing `last_seen_at` completely disable HOT updates, causing massive write amplification and index bloat?

## Follow-up questions

- If an UPDATE modifies a column that is part of a Partial Index, but the old and new row values do NOT satisfy the partial index predicate, can the update still be HOT-eligible?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
