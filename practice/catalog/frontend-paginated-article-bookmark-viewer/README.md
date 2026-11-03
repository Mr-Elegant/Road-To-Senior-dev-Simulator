# Frontend: Paginated Article Bookmark Viewer

Collection: catalog · ID: `frontend-paginated-article-bookmark-viewer` · Mode: **react**

## Business context

Build and verify the core behavior behind Paginated Article Bookmark Viewer. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({items=[A,B,C,D,E],pageSize=2}). Render page-size li[data-article=LABEL] rows, Bookmark[data-bookmark=LABEL] toggles, Next/Previous[data-action=next/previous] clamped at valid pages. [data-testid=page] is 1-based or zero for empty. [data-testid=saved] contains comma-joined saved IDs in insertion order. Bookmarks survive page changes.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add remote pagination with stale-response protection and explicit loading/error states.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-paginated-article-bookmark-viewer
npm run practice:watch -- catalog/frontend-paginated-article-bookmark-viewer
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
