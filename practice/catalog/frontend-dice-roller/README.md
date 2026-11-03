# Frontend: Dice Roller

Collection: catalog · ID: `frontend-dice-roller` · Mode: **react**

## Business context

Build and verify the core behavior behind Dice Roller. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({draws=[0],sides=6}). Roll consumes the next injected fraction in [0,1), falling back to 0, and displays floor(draw*sides)+1 in [data-testid=roll]. Before a roll show -. This deterministic randomness adapter must not regenerate on render.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Replace pseudorandom rolls with a cryptographic uniform integer sampler and explain modulo bias.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-dice-roller
npm run practice:watch -- catalog/frontend-dice-roller
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
