# React + TypeScript: Captcha Generator

Collection: catalog · ID: `react-ts-captcha-generator` · Mode: **react**

## Business context

Build and verify the core behavior behind Captcha Generator. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({challenges=[AB12,CD34]}). Show current [data-testid=challenge]. Answer input plus Verify[data-action=verify] reports Correct/Incorrect in [data-testid=feedback], trimming and uppercasing. Regenerate cycles and clears input/feedback; an old challenge answer must fail. This client demo is inspectable and not an abuse boundary.

TypeScript contract: export default App and export AppProps. Use strict TSX with typed props, state, event handlers, refs and domain records. The compiler rejects implicit/explicit any and suppression directives before DOM tests or preview. Only react and react/jsx-runtime imports are supported.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.
- Model the component data and narrow nullable refs and unknown errors without disabling type checking.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.
- Keep the supplied AppProps contract and type-safe state transitions. A passing submission must type-check and pass the original DOM journeys.

## Follow-up questions

- Design an accessible server-validated alternative rather than obscuring text more aggressively.

## Work locally

Edit [solution.tsx](solution.tsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ts-captcha-generator
npm run practice:watch -- catalog/react-ts-captcha-generator
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
