# Frontend: Confetti Animation

Collection: catalog · ID: `frontend-confetti-animation` · Mode: **react**

## Business context

Build and verify the core behavior behind Confetti Animation. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({count=8,reducedMotion=false}). Celebrate displays count decorative particle spans [data-particle] unless reducedMotion, when none appear. Show Celebration complete in a status region. Clear removes particles/status. Count is valid 0..20. Keep animations transform/opacity based.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Move a larger particle simulation to canvas while bounding frame work and lifetime.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-confetti-animation
npm run practice:watch -- catalog/frontend-confetti-animation
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
