# React + TypeScript: Dark Mode

Collection: catalog · ID: `react-ts-dark-mode` · Mode: **react**

## Business context

An embedded workspace needs a theme control that affects only its own surface and does not mutate the host website.

## Task

Export App({ initialTheme = "light" }). Only initialTheme === "dark" starts dark; any other value starts light. Render a section [data-testid="surface"] with data-theme equal to the current theme. Render a button named Toggle appearance with aria-pressed true exactly in dark mode. Each activation toggles light/dark, updates [data-testid="current-theme"] to Light appearance or Dark appearance, and changes the surface foreground/background for readable contrast. Keep the theme local; do not write document.body, parent state, storage, or network.

TypeScript contract: export default App and export AppProps. Use strict TSX with typed props, state, event handlers, refs and domain records. The compiler rejects implicit/explicit any and suppression directives before DOM tests or preview. Only react and react/jsx-runtime imports are supported.

## Candidate tasks

- Implement the default-exported App component and the documented DOM contract.
- Run every interaction journey, explain edge cases, then compare your implementation with the reference.
- Model the component data and narrow nullable refs and unknown errors without disabling type checking.

## Constraints

- Read the initial prop lazily when state is initialized; later user toggles are independent.
- Use a native button and do not communicate mode through color alone.
- Keep the supplied AppProps contract and type-safe state transitions. A passing submission must type-check and pass the original DOM journeys.

## Follow-up questions

- How would a product-wide persisted theme differ?

## Work locally

Edit [solution.tsx](solution.tsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ts-dark-mode
npm run practice:watch -- catalog/react-ts-dark-mode
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
