# Sort loans without mutating Redux state

Collection: loan · ID: `bug-5-redux-state-mutation` · Mode: **loan**

## Business context

A developer copies array references using shallow array methods (`const items = state.items; items.sort(...)`), mutating the frozen state in place or returning a new value while also mutating draft state in Redux Toolkit.

## Task

Implement sortLoans(items, sorting), returning an array ordered by sorting.field (loanAmount or applicantName) and sorting.order (asc or desc). Never mutate the input array or loan objects. Keep original relative order for equal values. Compare numeric amounts numerically and names lexicographically using ordinary JavaScript string ordering. Inputs are frozen.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- loan/bug-5-redux-state-mutation
npm run practice:watch -- loan/bug-5-redux-state-mutation
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
