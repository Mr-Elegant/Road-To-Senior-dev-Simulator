# Frontend: Draw Circles

Collection: catalog · ID: `frontend-draw-circles` · Mode: **react**

## Business context

Build and verify the core behavior behind Draw Circles. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Inputs X and Y names x/y accept finite coordinates 0..200. Add circle creates an SVG circle with cx/cy and radius 10; invalid/blank coordinates show Invalid position. Undo removes latest; Clear removes all. This tests drawing-state geometry with typed coordinates, not pointer-coordinate conversion.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Add redo and a keyboard placement mode without coupling geometry to browser viewport coordinates.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-draw-circles
npm run practice:watch -- catalog/frontend-draw-circles
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
