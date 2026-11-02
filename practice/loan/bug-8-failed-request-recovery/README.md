# Leave loading and support retry after a failure

Collection: loan · ID: `bug-8-failed-request-recovery` · Mode: **loan**

## Business context

A network drop or 503 gateway timeout occurs. The UI skeleton spinner spins indefinitely, the table is unclickable, and the user must hard-refresh the page to regain control.

## Task

Implement reduceRequest(state, action) with items,status,activeRequestId,error. pending records requestId, sets loading and clears any error. Only the active request can fulfill or reject. fulfilled stores action.items and succeeded; rejected stores failed and action.error, or "Request failed" if missing. An aborted active rejection returns idle with no error. All terminal states clear activeRequestId and preserve prior items on failure/abort. Unknown and stale events do nothing. Inputs are frozen.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- loan/bug-8-failed-request-recovery
npm run practice:watch -- loan/bug-8-failed-request-recovery
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
