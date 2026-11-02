# Two-Phase Commit (2PC) and Orphaned Prepared Transaction Disasters

Collection: sql · ID: `sql-tier4-012` · Mode: **guided**

## Business context

An external microservice coordinator used PostgreSQL Two-Phase Commit (`PREPARE TRANSACTION`) to coordinate loan disbursements across a banking ledger and core PostgreSQL. The coordinator service crashed midway. Days later, table bloat explodes and autovacuum is paralyzed.

## Task

Explain Two-Phase Commit (2PC) in PostgreSQL (`PREPARE TRANSACTION` and `COMMIT PREPARED`). What happens when a prepared transaction is orphaned? Why do orphaned prepared transactions lock table rows indefinitely and prevent VACUUM from freezing dead tuples across the entire database?

## Follow-up questions

- Should web applications or microservices use PostgreSQL 2PC directly, or is an alternative architectural pattern preferred?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
