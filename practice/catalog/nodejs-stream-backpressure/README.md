# Multi-Gigabyte Financial Audit CSV Export Out-of-Memory (OOM) Crash

Collection: catalog · ID: `nodejs-stream-backpressure` · Mode: **guided**

## Business context

A compliance portal provides a button for financial auditors to export yearly transaction records (typically 3,000,000 rows, ~1.8GB CSV). Whenever an auditor triggers the export, the Node.js container memory spikes past the 2GB limit and Kubernetes kills the container with `ExitCode 137 (OOMKilled)`.

## Task

The export handler queries all 3 million rows from PostgreSQL with a single `db.query()` and pushes formatted CSV strings into an HTTP response stream using `res.write()` in a fast while loop without respecting stream backpressure or `readable.pause()`. The buffer memory fills up faster than the client can download, crashing the server.

## Candidate tasks

- Explain how `res.write()` backpressure works and what the return value `false` indicates.
- Refactor to use PostgreSQL Cursor stream (`pg-query-stream`) piped through a Transform stream.
- Use `stream.pipeline()` to handle errors and clean up socket listeners on premature client disconnect.

## Constraints

- Export must stream smoothly with flat, bounded memory consumption (under 80MB RSS).
- Must respect Stream backpressure (`res.write() === false` and `drain` event).
- Use Node.js `stream.pipeline` or database cursor stream.

## Follow-up questions

- Why is `stream.pipeline` preferred over `source.pipe(destination)` in modern Node.js?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
