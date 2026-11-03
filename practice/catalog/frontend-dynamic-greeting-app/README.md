# Frontend: Dynamic Greeting App

Collection: catalog · ID: `frontend-dynamic-greeting-app` · Mode: **react**

## Business context

Build and verify the core behavior behind Dynamic Greeting App. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({hour=9}). A controlled input labelled Name starts empty. Render [data-testid="greeting"] as Good morning, NAME! for hours <12, Good afternoon for <18, otherwise Good evening. Trim Name and use friend when blank. No wall-clock timer is required; hour is injected.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Show a user-selected timezone and handle the case where the device time changes.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-dynamic-greeting-app
npm run practice:watch -- catalog/frontend-dynamic-greeting-app
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
