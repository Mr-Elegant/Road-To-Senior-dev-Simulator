# Linux OOM Killer Tuning, overcommit_memory, and PostgreSQL Work_mem

Collection: sql · ID: `sql-tier4-013` · Mode: **guided**

## Business context

Without warning, the primary PostgreSQL instance abruptly shuts down during month-end reporting. Kernel syslog shows: `Out of Memory: Killed process 4102 (postgres) total-vm: 64GB, anon-rss: 58GB`. After restart, the database went through a 15-minute crash recovery.

## Task

Analyze how Linux Out-Of-Memory (OOM) Killer interacts with PostgreSQL memory management. Explain `shared_buffers` vs `work_mem` multiplication per connection, Linux `vm.overcommit_memory`, `vm.overcommit_ratio`, and how to configure `oom_score_adj` to protect the PostgreSQL postmaster.

## Follow-up questions

- How should `work_mem` be configured safely on a database that serves both fast OLTP queries and occasional heavy reporting queries?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
