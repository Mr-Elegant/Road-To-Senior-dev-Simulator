# Admit distinct queries, suppress duplicate in-flight work

Collection: loan · ID: `bug-2-duplicate-api-calls` · Mode: **loan**

## Business context

Every time a parent component re-renders or the user tabs between drawer views, duplicate identical GET requests hit the `/api/applications` and `/api/dashboard/stats` endpoints.

## Task

Implement shouldFetch(active, next). active is null or {status, query}; next is {search,status,page,limit}. Return false only if an identical query is already loading. Compare the four query values, not object identity or JSON property order. Return true for changed queries, completed/failed requests, or no active request. Do not suppress all requests merely because one is loading.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- loan/bug-2-duplicate-api-calls
npm run practice:watch -- loan/bug-2-duplicate-api-calls
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
