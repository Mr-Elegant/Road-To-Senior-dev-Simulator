# React + TypeScript: Progress Bar

Collection: catalog · ID: `react-ts-progress-bar` · Mode: **react**

## Business context

A project dashboard receives progress values from multiple importers, including values outside the display range.

## Task

Export App({ value = 0 }). Accept only finite JavaScript numbers; all other values display zero. Clamp the number to 0–100, then round to the nearest integer. Render an element with role=progressbar, aria-label="Project completion", aria-valuemin="0", aria-valuemax="100", and aria-valuenow equal to the display integer. Show the same integer followed by % in [data-testid="percentage"]. The displayed value must be derived from props rather than copied into mount-only state.

TypeScript contract: export default App and export AppProps. Use strict TSX with typed props, state, event handlers, refs and domain records. The compiler rejects implicit/explicit any and suppression directives before DOM tests or preview. Only react and react/jsx-runtime imports are supported.

## Candidate tasks

- Implement the default-exported App component and the documented DOM contract.
- Run every interaction journey, explain edge cases, then compare your implementation with the reference.
- Model the component data and narrow nullable refs and unknown errors without disabling type checking.

## Constraints

- Numeric strings are invalid and must not be coerced.
- The visual fill and accessible numeric value must agree. No animation is required.
- Keep the supplied AppProps contract and type-safe state transitions. A passing submission must type-check and pass the original DOM journeys.

## Follow-up questions

- What if the total work is unknown?

## Work locally

Edit [solution.tsx](solution.tsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ts-progress-bar
npm run practice:watch -- catalog/react-ts-progress-bar
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
