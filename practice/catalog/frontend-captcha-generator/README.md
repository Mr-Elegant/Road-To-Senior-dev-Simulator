# Frontend: Captcha Generator

Collection: catalog · ID: `frontend-captcha-generator` · Mode: **react**

## Business context

Build and verify the core behavior behind Captcha Generator. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({challenges=[AB12,CD34]}). Show current [data-testid=challenge]. Answer input plus Verify[data-action=verify] reports Correct/Incorrect in [data-testid=feedback], trimming and uppercasing. Regenerate cycles and clears input/feedback; an old challenge answer must fail. This client demo is inspectable and not an abuse boundary.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Design an accessible server-validated alternative rather than obscuring text more aggressively.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-captcha-generator
npm run practice:watch -- catalog/frontend-captcha-generator
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
