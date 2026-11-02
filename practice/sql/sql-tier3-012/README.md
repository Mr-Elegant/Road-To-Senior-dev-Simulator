# PgBouncer Connection Pooling: Session vs Transaction vs Statement Modes

Collection: sql · ID: `sql-tier3-012` · Mode: **guided**

## Business context

A Node.js backend running 50 Kubernetes pods establishes 20 connections per pod (1,000 total connections) directly to PostgreSQL. The database server’s memory is exhausted, context switching spikes, and query response time degrades by 800%.

## Task

Analyze how PgBouncer connection pooling resolves PostgreSQL connection scalability limits. Compare the three pooling modes: Session, Transaction, and Statement. What PostgreSQL features break under Transaction Pooling, and how do you resolve them?

## Follow-up questions

- How does PgBouncer 1.21+ allow named prepared statements to work in transaction pooling mode?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
