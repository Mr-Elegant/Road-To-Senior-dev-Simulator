# Read current filters when a refresh actually runs

Collection: loan · ID: `bug-7-stale-closure` · Mode: **loan**

## Business context

A background polling interval or debounced callback dispatches a refresh request using stale filter values captured when the callback was initially created.

## Task

Implement createRefresh(getState, send), returning a synchronous refresh callback. On each callback invocation, read the current state {filters,pagination} and call send once with {...filters,page:pagination.page,limit:pagination.limit}. Do not send while creating the callback. The same callback must work after filters and pagination are replaced. Capture a fresh request snapshot; do not mutate state or previously sent requests.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- loan/bug-7-stale-closure
npm run practice:watch -- loan/bug-7-stale-closure
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
