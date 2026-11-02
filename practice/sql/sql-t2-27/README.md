# PostgreSQL Read Replicas and Replication Lag

Collection: sql · ID: `sql-t2-27` · Mode: **guided**

## Business context

A user updates their shipping address on an e-commerce site, clicks save, and is redirected to their profile page. The profile page still displays their old address. A refresh 2 seconds later shows the new address.

## Task

What is Replication Lag in primary-replica database architectures? What read-after-write consistency problem did this user experience, and how is it resolved?

## Follow-up questions

- Why not use Synchronous Replication for all read replicas to eliminate lag completely?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
