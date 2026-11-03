# Frontend: Animated Loading Skeleton

Collection: catalog · ID: `frontend-animated-loading-skeleton` · Mode: **react**

## Business context

Build and verify the core behavior behind Animated Loading Skeleton. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({state="loading",content="Ready"}). loading renders [data-testid="skeleton"] aria-hidden=true and sets region aria-busy=true. success renders content, empty renders No results, error renders Unable to load. Only loading has a skeleton. No network request is required.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Coordinate several regions so partial data can render without resetting already usable sections.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-animated-loading-skeleton
npm run practice:watch -- catalog/frontend-animated-loading-skeleton
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
