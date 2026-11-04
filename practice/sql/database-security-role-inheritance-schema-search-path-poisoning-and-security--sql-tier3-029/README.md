# Database Security: Role Inheritance, Schema search_path Poisoning, and SECURITY DEFINER

Collection: sql · ID: `sql-tier3-029` · Mode: **guided**

## Business context

A database security review reveals a function `process_refund(order_id INT)` created with `SECURITY DEFINER` by a `postgres` superuser. A junior engineer added an unprivileged tenant user who was able to execute arbitrary code with superuser privileges.

## Task

Explain the security risks of `SECURITY DEFINER` functions in PostgreSQL. What is `search_path` hijacking/poisoning, how do attackers exploit it, and what are the mandatory defensive measures (including `SET search_path = pg_catalog, pg_temp`) required when creating privileged functions?

## Follow-up questions

- Why does PostgreSQL 15+ no longer grant `CREATE` privileges on the `public` schema to `PUBLIC` by default?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
