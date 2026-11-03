# Frontend: User profile

Collection: catalog · ID: `frontend-user-profile` · Mode: **react**

## Business context

Build and verify the core behavior behind User profile. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({profile}). Missing profile renders Profile unavailable. Otherwise render name as h1, bio in [data-testid="bio"] default No biography, and either img with alt=name or [data-testid="avatar-fallback"] containing uppercase first name character. Do not fetch remotely.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Separate public profile fields from account-private details using a server-defined response contract.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-user-profile
npm run practice:watch -- catalog/frontend-user-profile
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
