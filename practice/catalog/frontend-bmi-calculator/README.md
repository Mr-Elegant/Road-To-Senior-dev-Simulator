# Frontend: BMI Calculator

Collection: catalog · ID: `frontend-bmi-calculator` · Mode: **react**

## Business context

Build and verify the core behavior behind BMI Calculator. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Weight is kilograms, Height is centimetres. Both must be finite and positive. Return BMI rounded to two decimal places as a string, or show Invalid measurements. This is educational arithmetic, not a diagnosis. Render controlled labelled inputs with these exact names: Weight, Height. A Calculate submit button computes the result. Render JSON.stringify(result) in [data-testid="result"]. Validation failure clears result and shows the documented message in [data-testid="error"].

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add unit-preserving conversions so switching units does not silently reinterpret the same raw number.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-bmi-calculator
npm run practice:watch -- catalog/frontend-bmi-calculator
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
