# Kubernetes Rolling Deployment Background Transaction Data Loss

Collection: catalog · ID: `nodejs-graceful-shutdown-worker` · Mode: **guided**

## Business context

During automated CI/CD deployments of a payout processing worker service on Kubernetes, payouts occasionally get left in a half-processed `PENDING` state with missing bank transfers, requiring manual database surgery to reconcile balances.

## Task

When Kubernetes deploys a new replica set, it sends a `SIGTERM` signal to the old pods. The Node.js application immediately executed `process.exit(0)` inside the `SIGTERM` handler. Any background database transaction currently running mid-flight was aborted abruptly without rolling back or finishing, corrupting ledger balances.

## Candidate tasks

- Explain the Kubernetes pod termination lifecycle (`preStop`, `SIGTERM`, `terminationGracePeriodSeconds`, `SIGKILL`).
- Implement coordinated graceful shutdown: stop accepting new work -> wait for in-flight tasks -> close DB pools -> `process.exit(0)`.
- Add a hard timeout fallback so the process exits even if a stuck connection hangs.

## Constraints

- Must intercept `SIGTERM` and `SIGINT` signals.
- Stop accepting new jobs from Redis / BullMQ / SQS queue.
- Allow active in-flight transactions a graceful grace period (e.g. 15s) to complete.
- Close database connection pools cleanly before exiting.

## Follow-up questions

- Why do Kubernetes engineers recommend adding a `preStop` sleep 5 hook before SIGTERM in Node.js pods?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
