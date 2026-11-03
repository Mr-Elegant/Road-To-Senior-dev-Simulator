# React + TypeScript: Filter Recipes

Collection: catalog · ID: `react-ts-filter-recipes` · Mode: **react**

## Business context

A kitchen planning screen filters a small recipe list while retaining users’ selected dishes when they change their search.

## Task

Export App({ recipes = [] }). Each recipe has a unique string id, name, and category. Render a controlled Search recipes input and a Category select. All is the initial category; remaining options are unique category strings in first-seen order. Filter by trimmed, case-insensitive name substring AND exact selected category. Render visible recipes as li elements in [data-testid="recipes"], each showing its name and a native toggle button named Select NAME or Deselect NAME. Track selection by ID across filtering. [data-testid="selected-count"] contains the selected count as digits. No matches shows No matching recipes in [data-testid="empty"]. Do not mutate recipes.

TypeScript contract: export default App and export AppProps. Use strict TSX with typed props, state, event handlers, refs and domain records. The compiler rejects implicit/explicit any and suppression directives before DOM tests or preview. Only react and react/jsx-runtime imports are supported.

## Candidate tasks

- Implement the default-exported App component and the documented DOM contract.
- Run every interaction journey, explain edge cases, then compare your implementation with the reference.
- Model the component data and narrow nullable refs and unknown errors without disabling type checking.

## Constraints

- Input recipe fields are valid strings; IDs are unique. All is reserved for the aggregate option.
- Selections persist when hidden by filtering; a second activation deselects the same ID.
- Keep the supplied AppProps contract and type-safe state transitions. A passing submission must type-check and pass the original DOM journeys.

## Follow-up questions

- What if selected recipes disappear from a refreshed dataset?

## Work locally

Edit [solution.tsx](solution.tsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ts-filter-recipes
npm run practice:watch -- catalog/react-ts-filter-recipes
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
