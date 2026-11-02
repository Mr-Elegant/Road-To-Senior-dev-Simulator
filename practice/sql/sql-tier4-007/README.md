# Production Incident: Stalled Autovacuum & Impending 2-Billion XID Wraparound

Collection: sql · ID: `sql-tier4-007` · Mode: **guided**

## Business context

A multi-terabyte SaaS database generates a pager alert: `Transaction ID wraparound threshold reached: database age is 2,050,000,000. PostgreSQL will refuse new transactions in 90 million XIDs.` An anti-wraparound autovacuum process on `audit_logs` has been stuck for 18 hours.

## Task

Diagnose why the anti-wraparound autovacuum is blocked from advancing the datfrozenxid horizon. Inspect the telemetry, identify blocking queries or idle sessions, and write the immediate commands to unblock vacuum and prevent emergency database shutdown.

## Follow-up questions

- What happens if the database reaches $2^{31}$ transactions before the freeze completes?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
