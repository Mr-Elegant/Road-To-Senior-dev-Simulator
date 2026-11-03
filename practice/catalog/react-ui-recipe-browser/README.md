# React UI: Searchable Kitchen Cards

Collection: catalog · ID: `react-ui-recipe-browser` · Mode: **react**

## Business context

A kitchen planning screen filters a small recipe list while retaining users’ selected dishes when they change their search.

## Task

Export App({ recipes = [] }). Each recipe has a unique string id, name, and category. Render a controlled Search recipes input and a Category select. All is the initial category; remaining options are unique category strings in first-seen order. Filter by trimmed, case-insensitive name substring AND exact selected category. Render visible recipes as li elements in [data-testid="recipes"], each showing its name and a native toggle button named Select NAME or Deselect NAME. Track selection by ID across filtering. [data-testid="selected-count"] contains the selected count as digits. No matches shows No matching recipes in [data-testid="empty"]. Do not mutate recipes.

## Candidate tasks

- Implement the default-exported App component and the documented DOM contract.
- Run every interaction journey, explain edge cases, then compare your implementation with the reference.

## Constraints

- Input recipe fields are valid strings; IDs are unique. All is reserved for the aggregate option.
- Selections persist when hidden by filtering; a second activation deselects the same ID.

## Follow-up questions

- What if selected recipes disappear from a refreshed dataset?

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/react-ui-recipe-browser
npm run practice:watch -- catalog/react-ui-recipe-browser
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
