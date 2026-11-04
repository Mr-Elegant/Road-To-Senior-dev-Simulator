# Database Security Hardening: SCRAM-SHA-256, Connection Quotas, and pgaudit

Collection: sql · ID: `sql-tier4-020` · Mode: **guided**

## Business context

Your fintech application must pass a SOC2 Type II security audit and PCI-DSS compliance. The security auditor identifies legacy MD5 password hashing, unrestricted connection counts per user, and lack of fine-grained DDL audit logging.

## Task

Design a production-grade database security hardening blueprint for PostgreSQL. Explain the migration from `md5` to `scram-sha-256`, connection limits per role (`CONNECTION LIMIT`), schema isolation, and the implementation of the `pgaudit` extension for compliance logging.

## Follow-up questions

- Why should `pgaudit.log = 'READ'` be used with extreme caution on production databases?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
