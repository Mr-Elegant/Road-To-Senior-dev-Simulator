# Frontend: Slugify a String

Collection: catalog · ID: `frontend-slugify-a-string` · Mode: **react**

## Business context

Build and verify the core behavior behind Slugify a String. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Derive a lowercase ASCII slug: trim, lowercase, replace every run of non-a-z/non-0-9 characters with one hyphen, remove outside hyphens. This bounded contract does not transliterate Unicode or ensure uniqueness. Render controlled labelled inputs with these exact names: Title. A Calculate submit button computes the result. Render JSON.stringify(result) in [data-testid="result"]. Validation failure clears result and shows the documented message in [data-testid="error"].

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add reserved-word checks and server-side uniqueness without changing existing public URLs silently.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-slugify-a-string
npm run practice:watch -- catalog/frontend-slugify-a-string
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
