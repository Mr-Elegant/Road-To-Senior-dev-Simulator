# Frontend: Tabs Component

Collection: catalog · ID: `frontend-tabs-component` · Mode: **react**

## Business context

Build and verify the core behavior behind Tabs Component. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App. Tabs One and Two link to panels First and Second. Initially One selected. Use tablist, tab, tabpanel, aria-selected, roving tabindex and matching ids. ArrowRight/Left wrap, Home/End select boundary and move focus; activation is automatic. Render only active panel.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Support vertical orientation and dynamic tab removal while preserving an understandable focus target.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-tabs-component
npm run practice:watch -- catalog/frontend-tabs-component
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
