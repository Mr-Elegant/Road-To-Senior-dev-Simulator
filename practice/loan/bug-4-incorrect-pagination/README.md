# Reset pagination when the query changes

Collection: loan · ID: `bug-4-incorrect-pagination` · Mode: **loan**

## Business context

A user navigates to Page 6 of loan applications. They then apply a filter for `status === "REJECTED"`, which only has 2 matching records. The table displays "No records found" because it requested Page 6 of a 1-page result set.

## Task

Implement updateQuery(state, change) for state {filters:{search,status,loanType,riskRating},pagination:{page,limit}}. change may contain any filter fields and/or a positive integer limit. Merge supplied filter fields and limit. Reset page to 1 only when a supplied query value actually changes; preserve page on a no-op. Preserve all unspecified fields. Inputs are frozen.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- loan/bug-4-incorrect-pagination
npm run practice:watch -- loan/bug-4-incorrect-pagination
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
