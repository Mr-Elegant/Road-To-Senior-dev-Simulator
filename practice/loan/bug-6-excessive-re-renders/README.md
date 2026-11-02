# Keep selector results stable for unrelated updates

Collection: loan · ID: `bug-6-excessive-re-renders` · Mode: **loan**

## Business context

Typing into the search input causes all 50 table rows, all 5 metric cards, and the drawer component to re-render on every single character, causing typing latency on low-power devices.

## Task

Implement createLoanSelector(), returning a one-entry memoized select(state) function. state has items and filters {status,search}; unrelated ui fields may change. Filter status unless ALL, and match applicantName case-insensitively using trimmed search. Reuse the exact previous result array when the items reference, status value and normalized search are unchanged, even if state/filters objects are fresh. Recompute when those inputs change. Keep cache private to each selector instance. Inputs are frozen.

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- loan/bug-6-excessive-re-renders
npm run practice:watch -- loan/bug-6-excessive-re-renders
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
