# Frontend: Markdown Editor

Collection: catalog · ID: `frontend-markdown-editor` · Mode: **react**

## Business context

Build and verify the core behavior behind Markdown Editor. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Controlled Markdown textarea previews a safe limited grammar: each line starting # becomes h1, ## becomes h2, all other lines become p. Strip the marker plus one optional following space. Render all remaining characters literally, not HTML. Wrap preview in [data-testid="preview"].

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add asynchronous preview computation with revision checks so stale parses cannot overwrite newer text.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-markdown-editor
npm run practice:watch -- catalog/frontend-markdown-editor
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
