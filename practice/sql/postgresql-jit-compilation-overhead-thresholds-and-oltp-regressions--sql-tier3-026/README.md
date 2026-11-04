# PostgreSQL JIT Compilation: Overhead, Thresholds, and OLTP Regressions

Collection: sql · ID: `sql-tier3-026` · Mode: **guided**

## Business context

After upgrading to PostgreSQL 12+, an OLTP payment API experiences random latency spikes where individual queries that normally take 2ms take 120ms. Looking at `EXPLAIN ANALYZE`, you see `JIT: Functions: 14, Options: Inlining true, Optimization true, Emission true, Timing: Generation 1.2ms, Inlining 24.5ms, Optimization 62.1ms, Emission 31.8ms`.

## Task

Explain PostgreSQL Just-In-Time (JIT) compilation (using LLVM). What does JIT accelerate (expression evaluation, tuple deforming), what causes JIT overhead in OLTP environments, and which configuration parameters control when JIT engages?

## Follow-up questions

- Why does a query with a low actual execution time trigger JIT if `jit_above_cost = 100000` is set to a high number?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
