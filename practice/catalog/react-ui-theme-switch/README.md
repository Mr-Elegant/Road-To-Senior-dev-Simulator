# React UI: Scoped Appearance Switch

Collection: catalog · ID: `react-ui-theme-switch` · Mode: **react**

## Business context

An embedded workspace needs a theme control that affects only its own surface and does not mutate the host website.

## Task

Export App({ initialTheme = "light" }). Only initialTheme === "dark" starts dark; any other value starts light. Render a section [data-testid="surface"] with data-theme equal to the current theme. Render a button named Toggle appearance with aria-pressed true exactly in dark mode. Each activation toggles light/dark, updates [data-testid="current-theme"] to Light appearance or Dark appearance, and changes the surface foreground/background for readable contrast. Keep the theme local; do not write document.body, parent state, storage, or network.

## Candidate tasks

- Implement the default-exported App component and the documented DOM contract.
- Run every interaction journey, explain edge cases, then compare your implementation with the reference.

## Constraints

- Read the initial prop lazily when state is initialized; later user toggles are independent.
- Use a native button and do not communicate mode through color alone.

## Follow-up questions

- How would a product-wide persisted theme differ?

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ui-theme-switch
npm run practice:watch -- catalog/react-ui-theme-switch
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
