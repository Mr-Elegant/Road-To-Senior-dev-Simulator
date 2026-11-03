# React UI practice

Eight original beginner JSX component exercises are available in **Challenges**. Search **React UI:** and select **Beginner** difficulty. The existing production React scenarios and beginner theory track remain available.

| Exercise | Route suffix under `/challenge/` | DOM journeys |
| --- | --- | ---: |
| Account Password Feedback | `react-ui-password-feedback` | 5 |
| Web Address Inspector | `react-ui-web-address` | 6 |
| Team Tag Editor | `react-ui-tag-editor` | 6 |
| Project Completion Meter | `react-ui-project-progress` | 6 |
| Monthly Loan Estimator | `react-ui-loan-estimator` | 5 |
| Expandable Support Answers | `react-ui-help-panels` | 5 |
| Scoped Appearance Switch | `react-ui-theme-switch` | 5 |
| Searchable Kitchen Cards | `react-ui-recipe-browser` | 5 |

## Browser workflow

Edit `solution.jsx`, keeping a default-exported `App`. JavaScript, JSX, hooks, and imports from `react` and `react/jsx-runtime` are supported. Other package imports, CSS imports, TypeScript syntax, and network integrations are outside this runner's contract.

**Preview** mounts an interactive component with the first configured props fixture, or empty props when none exist. It runs a snapshot: edit and click Preview again to apply changes. **Run Tests** mounts a fresh iframe per journey, performs input/click/key actions, and checks exact DOM text, values, attributes, or counts. Text assertions collapse whitespace and trim boundaries. Preview and results are mutually exclusive, closable panels; the editor fills the available space when closed.

Run tests on current code before submitting. React exercise scores come from passed journeys; the existing rubric records reasoning and self-assessment. Bookmarks, account-scoped attempt history, hints, and reference review use existing app flows. Unsaved editor text is not persisted across reloads, as in the existing generic workspace. Use local IDE files for durable practice work.

Passing authored fixtures does not certify every possible input, full accessibility, or production behavior. Follow-up answers describe where a production design needs additional work.

## Architecture and isolation

`scripts/build-react-runtime.mjs` bundles React, ReactDOM, and Sucrase into a self-hosted static asset before dev/build and authentication-check builds. The generated asset is ignored by Git; its source and lockfile are tracked. There is no remote preview compiler or runtime CDN. The app loads the bundle only on preview/test execution.

Candidate code is transferred through a private MessageChannel into an opaque-origin iframe with `sandbox="allow-scripts allow-forms"`, without same-origin access. Native submit events work; CSP `form-action 'none'` still blocks form navigation, and connection requests and external assets are disabled. Candidate code is not executed on the application server or in the parent document's scope. This is an educational runner for local code, not hostile submissions or tamper-proof grading.

The parent applies an eight-second response deadline while the browser is responsive. A DOM iframe **cannot guarantee interruption of a synchronous infinite loop**; this is not the loan lab's Worker CPU deadline. Blocking candidate code may require closing/reloading the tab. A public service accepting hostile submissions requires a stronger process/resource-isolation architecture.

## VS Code workflow

```sh
npm ci
npx playwright install chromium
npm run react:runtime
npm run practice:list -- react-ui
npm run practice:test -- catalog/react-ui-tag-editor
npm run practice:watch -- catalog/react-ui-tag-editor
```

Edit `practice/catalog/react-ui-tag-editor/solution.jsx`. Briefs, fixtures, reference JSX, explanations, pitfalls, and follow-up answers are exported alongside each exercise. Generation preserves candidate solutions and answers.

The CLI reuses the runtime and journeys in fresh local Chromium pages. Next.js, PostgreSQL, app environment files, and an account are unnecessary. A React CLI suite has a 90-second process deadline and each DOM evaluation an eight-second response deadline. Results do not sync to website progress.

## Expansion order

The [implementation plan](research/react-practice-implementation.md) records the confirmed order: easy React, medium/hard React, then JavaScript. This first delivery covers **8 of 39 easy React topic references**; the remaining 31 are planned.

Prompts, contracts, fixtures, and reference solutions are independently authored. The [research index](research/namastedev-challenge-index.md) supplies source links and topic references, without copying the source site's statements, solutions, or test fixtures.

Implementation references: [React createRoot](https://react.dev/reference/react-dom/client/createRoot), [esbuild bundling](https://esbuild.github.io/api/#bundle), and the installed Sucrase transformer API/type definitions.
