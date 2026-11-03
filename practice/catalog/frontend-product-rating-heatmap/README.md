# Frontend: Product Rating Heatmap

Collection: catalog · ID: `frontend-product-rating-heatmap` · Mode: **react**

## Business context

Build and verify the core behavior behind Product Rating Heatmap. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({values=[[0,2],[4,1]]}). Render a table of td cells, text=value and data-level=floor(value/globalMax*4), or 0 when global max=0. Null means missing: text - and data-level=missing. Values are a bounded rectangular matrix of nonnegative numbers/null. Include caption Ratings and accessible text rather than color alone.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Switch between absolute and relative scales and explain how each can mislead comparisons.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-product-rating-heatmap
npm run practice:watch -- catalog/frontend-product-rating-heatmap
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
