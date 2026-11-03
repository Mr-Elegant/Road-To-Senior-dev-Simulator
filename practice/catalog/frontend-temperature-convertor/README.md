# Frontend: Temperature Convertor

Collection: catalog · ID: `frontend-temperature-convertor` · Mode: **react**

## Business context

Build and verify the core behavior behind Temperature Convertor. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Convert finite Celsius to Fahrenheit with F=C*9/5+32. Return a two-decimal string; blank/nonfinite input shows Invalid temperature. Keep the source draft as text. Render controlled labelled inputs with these exact names: Celsius. A Calculate submit button computes the result. Render JSON.stringify(result) in [data-testid="result"]. Validation failure clears result and shows the documented message in [data-testid="error"].

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add Kelvin with an explicit physical lower-bound policy and separate display rounding from stored precision.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-temperature-convertor
npm run practice:watch -- catalog/frontend-temperature-convertor
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
