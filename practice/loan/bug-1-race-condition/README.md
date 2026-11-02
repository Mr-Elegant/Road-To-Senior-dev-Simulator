# Keep the newest search result

Collection: loan · ID: `bug-1-race-condition` · Mode: **loan**

## Business context

A user searches for "Aarav", then quickly deletes it and searches for "Sophia". The first slow API call finishes after the second fast call and overwrites the active table results with the stale query.

## Task

Implement reduceSearch(state, action) as a pure reducer. State has items, status, activeRequestId and error. pending records action.requestId, sets loading and clears error. fulfilled/rejected may update only the active request. A matching fulfilled stores action.items; a matching rejected stores action.error. Terminal states clear activeRequestId. Unknown or stale actions preserve state. Inputs are frozen; return new objects for changes.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- loan/bug-1-race-condition
npm run practice:watch -- loan/bug-1-race-condition
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
