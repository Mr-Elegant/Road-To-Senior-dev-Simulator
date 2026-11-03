# Frontend: Star Rating

Collection: catalog · ID: `frontend-star-rating` · Mode: **react**

## Business context

Build and verify the core behavior behind Star Rating. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({initial=0,readOnly=false}). Render five radio buttons[data-rating=1..5] in a radiogroup, with aria-checked. Click commits rating; ArrowRight/Left clamps between 1 and 5. Output rating in [data-testid=rating]. Read-only mode ignores changes. No hover-only selection is committed.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Support fractional display without pretending half-star selection follows automatically from integer radios.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-star-rating
npm run practice:watch -- catalog/frontend-star-rating
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
