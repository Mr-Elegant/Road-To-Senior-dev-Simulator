# React + TypeScript: 24 Game

Collection: catalog · ID: `react-ts-24-game` · Mode: **react**

## Business context

Build and verify the core behavior behind 24 Game. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({numbers=[1,2,3,4]}). Expression input and Check button parse numbers, parentheses and + - * / with standard precedence, without eval. Use each supplied number exactly once. Output [data-testid=result] Correct when within 1e-9 of 24, Not 24 otherwise; wrong multiplicities show Invalid numbers and bad syntax/division by zero show Invalid expression. Unary operators are excluded.

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

- Use exact rational pairs and canonical-state memoization to avoid repeating symmetric search branches.

## Work locally

Edit [solution.tsx](solution.tsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ts-24-game
npm run practice:watch -- catalog/react-ts-24-game
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
