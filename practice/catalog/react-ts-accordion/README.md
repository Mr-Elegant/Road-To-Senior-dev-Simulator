# React + TypeScript: Accordion

Collection: catalog · ID: `react-ts-accordion` · Mode: **react**

## Business context

A compact support panel should expose one answer at a time while remaining usable with native keyboard controls.

## Task

Export App({ items = [] }). Each item has unique id, title, and body strings. Render a heading button per item, initially all collapsed. Activating a collapsed button opens its body and closes the previously open body; activating the same button collapses it. Each button needs aria-expanded and aria-controls="panel-ID". An open body is a region with id="panel-ID" and aria-labelledby referring to its button id="trigger-ID". Only open regions exist in the DOM. An empty array shows No help articles in [data-testid="empty"]. Use native buttons rather than clickable divs.

TypeScript contract: export default App and export AppProps. Use strict TSX with typed props, state, event handlers, refs and domain records. The compiler rejects implicit/explicit any and suppression directives before DOM tests or preview. Only react and react/jsx-runtime imports are supported.

## Candidate tasks

- Implement the default-exported App component and the documented DOM contract.
- Run every interaction journey, explain edge cases, then compare your implementation with the reference.
- Model the component data and narrow nullable refs and unknown errors without disabling type checking.

## Constraints

- Item IDs are unique, nonempty, HTML-id-safe strings; titles and bodies are plain text.
- Use stable item IDs for keys and open state, not array positions.
- Keep the supplied AppProps contract and type-safe state transitions. A passing submission must type-check and pass the original DOM journeys.

## Follow-up questions

- When would you keep closed panels mounted?

## Work locally

Edit [solution.tsx](solution.tsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ts-accordion
npm run practice:watch -- catalog/react-ts-accordion
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
