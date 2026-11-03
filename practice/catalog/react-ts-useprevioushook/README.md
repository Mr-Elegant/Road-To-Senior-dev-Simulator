# React + TypeScript: usePreviousHook

Collection: catalog · ID: `react-ts-useprevioushook` · Mode: **react**

## Business context

Build and verify the core behavior behind usePreviousHook. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({initial=0}). Implement usePrevious with a ref updated after commit. Show current in [data-testid="current"] and previous committed value in [data-testid="previous"], initially none. Increment updates current; unrelated renders are excluded from this bounded contract.

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

- Implement previous-distinct-value semantics and explain how it differs from previous-render semantics.

## Work locally

Edit [solution.tsx](solution.tsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ts-useprevioushook
npm run practice:watch -- catalog/react-ts-useprevioushook
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
