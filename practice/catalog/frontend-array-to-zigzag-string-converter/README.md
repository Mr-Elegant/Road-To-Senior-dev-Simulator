# Frontend: Array to Zigzag String Converter

Collection: catalog · ID: `frontend-array-to-zigzag-string-converter` · Mode: **react**

## Business context

Build and verify the core behavior behind Array to Zigzag String Converter. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Parse words from the Text input by whitespace. Preserve even-indexed words and reverse Unicode code points of odd-indexed words, then join with one space. This exercise defines zigzag as alternating word reversal. Render controlled labelled inputs with these exact names: Text. A Calculate submit button computes the result. Render JSON.stringify(result) in [data-testid="result"]. Validation failure clears result and shows the documented message in [data-testid="error"].

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Extend reversal to user-perceived graphemes and state the required segmentation support.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-array-to-zigzag-string-converter
npm run practice:watch -- catalog/frontend-array-to-zigzag-string-converter
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
