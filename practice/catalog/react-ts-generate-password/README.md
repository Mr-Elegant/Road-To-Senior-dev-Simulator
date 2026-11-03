# React + TypeScript: Generate Password

Collection: catalog · ID: `react-ts-generate-password` · Mode: **react**

## Business context

Build and verify the core behavior behind Generate Password. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({draws?}). Length input defaults 8, valid integers 4..32. Generate guarantees one character from each ab, AB, 01, ! class, fills from the combined alphabet, then Fisher–Yates shuffles. Use rejection-sampled crypto randomness unless fractional draws are injected and cycled. Show password in [data-testid=password] with data-length; invalid length clears output and shows Invalid length.

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

- Explain rejection sampling and why modulo reduction can bias a character distribution.

## Work locally

Edit [solution.tsx](solution.tsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ts-generate-password
npm run practice:watch -- catalog/react-ts-generate-password
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
