# SQL Injection Prevention: Parameterized Queries vs String Concatenation

Collection: sql · ID: `sql-t1-26` · Mode: **guided**

## Business context

A junior developer writes: `const query = "SELECT * FROM users WHERE email = '" + req.body.email + "'";`

## Task

Why is this code vulnerable to SQL Injection? What payload could an attacker submit, and how do Parameterized Queries (Prepared Statements) prevent this?

## Follow-up questions

- Can ORMs like Prisma or TypeORM still be vulnerable to SQL injection?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
