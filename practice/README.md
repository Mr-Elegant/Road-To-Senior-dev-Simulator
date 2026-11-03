# Practice in your local IDE

This workspace contains **all 586 authored exercises** from the app, grouped into five collections. The website and its progress remain independent. Open [INDEX.md](INDEX.md) in VS Code to find an exercise; Enterprise Labs project sequences appear at the bottom.

| Directory | Exercises | Workflow |
|---|---:|---|
| `catalog/` | 389 | Coding, debugging, React UI, incidents, reviews, design, and interviews |
| `loan/` | 8 | Function bugs with the same frozen-input behavioral harness as the app |
| `sql/` | 120 | Executable SQL fixtures plus conceptual, incident, and design answers |
| `beginner/` | 63 | Written questions and optional JavaScript/TypeScript/HTML/CSS exercises |
| `coding/` | 6 | JavaScript, TypeScript, SQL, and Python problems |

The eight evolving incidents, six commerce/SaaS challenges, and eight collaboration challenges are included in `catalog/`. Enterprise projects link to the existing 22 exercises rather than duplicating them. Randomized interview/mock sessions and AI follow-ups are app interactions built on this content, not additional fixed questions to export.

A separate React + TypeScript module adds 113 automated TSX copies of the React topics, each with strict type checking, 379 reused DOM cases and its own files. Use `npm run practice:list -- react-ts` to find them.

## Start

Use the repository's supported Node.js version and install dependencies from the repository root:

```sh
npm ci
npm run practice:list
npm run practice:list -- inventory
npm run practice:test -- catalog/commerce-inventory-reservations
npm run practice:watch -- catalog/commerce-inventory-reservations
```

1. Open the exercise's `README.md` and inspect its contracts and visible test cases.
2. Edit `solution.js`, `solution.ts`, `solution.sql`, or the supplied language file. Preserve function names. No import/export boilerplate is required for function exercises.
3. Run the command printed in that README. Broken starters are expected to fail. Watch reruns when you save; Ctrl+C stops it.
4. Explain your approach in `answer.md`. After your attempt, compare with `reference.md` and the separate reference code file.

You do not need to start Next.js, configure `.env.local`, connect PostgreSQL, or sign in. SQL execution uses temporary seeded in-memory engines, not the app's account database. Python needs a local `python` interpreter; set `PRACTICE_PYTHON` to its executable path if necessary.

```sh
npm run practice:test -- loan
npm run practice:test -- sql/sql-t1-01
npm run practice:test:all
npm run practice:verify
```

`practice:test` accepts a full key, unique ID, collection, or title search. With no selector it runs all executable exercises. A failed case returns a nonzero exit code. Guided exercises are counted separately and are never reported as passed tests. `practice:verify` checks the tooling and authored reference solutions without replacing your work. It requires Python for the Python reference check.

There are 377 automated exercises and 209 guided exercises. All 203 frontend topics are automated: 113 React components plus 90 JavaScript functions. Use `npm run practice:list -- frontend` for the new additions, or `npm run practice:list -- react-ui` for the eight reused React IDs.

## What the tests mean

- **JavaScript/TypeScript:** awaited structured return values are compared exactly, including every field. Legacy scalar expectations also accept their exact display-string form; partial text matches never pass. TypeScript syntax is transpiled; this is not a project-wide type-check. Each case has its own context, timers are cleaned up, and the CLI terminates an exercise exceeding its process deadline.
- **Frontend JavaScript:** 90 `catalog/frontend-*` function exercises require exact JSON values and documented runtime error messages. Each case gets a fresh mutable input; a syntax error never satisfies an expected runtime error. These do not use the legacy scalar-string compatibility rule.
- **Loan bugs:** the app's actual entry point, immutable fixture harness, and expected results are reused, including selector identity observations.
- **React UI:** 113 JSX components use the same React runtime and 379 DOM journeys as the app in local Chromium. Run `npx playwright install chromium` and `npm run react:runtime` first. Edit `solution.jsx` and retain its default export; use `npm run practice:test -- catalog/react-ui-tag-editor`. Next.js and the account database are not needed. See [React UI practice](../docs/REACT_UI_PRACTICE.md).
- **React + TypeScript:** edit `solution.tsx` under `catalog/react-ts-*`. Strict semantic checking runs before the shared Chromium DOM journeys. Props, state, refs and handlers are typed; explicit any and suppression directives fail this track. References and website progress are separate from the original JSX exercises. See [TSX practice](../docs/REACT_TYPESCRIPT_PRACTICE.md).
- **SQL track:** executable questions reuse the app's dialect-specific evaluator and authored cases. Standalone cohort retention uses AlaSQL date functions; top-N ranking uses PostgreSQL/PGlite because AlaSQL does not implement its `DENSE_RANK` function. Both compare every result row. This local dialect choice does not alter the standalone browser runner. Schemas/seeds are also available in `datasets/`.
- **Python:** the token-bucket problem runs authored `consume` cases against a fresh `TokenBucket(10, 2)` in a local interpreter.
- **Guided:** review code, UI snippets, foundational answers, architecture, interview, and incident exercises include the complete authored brief and reference/rubric. Some app fixtures describe an outcome (such as WCAG compliance) without an executable behavioral contract; those are deliberately guided here. They require manual review and, where appropriate, your own component or integration tests. The pack does not manufacture a passing score for them.

This is a local development workflow for your own code, not a security sandbox for running downloaded or hostile submissions. Node VM contexts and subprocess timeouts do not provide OS isolation. The local CLI does not load app environment files, but local processes have your normal machine permissions.

## Evolving incidents and written exercises

Read the initial telemetry and the timed stages/options in `exercise.json`. Work through them in time order; record your chosen actions, rationale, containment, rollback gates, and verification in `answer.md`. Then compare against the playbook and decision guidance in `reference.md`. The interactive clock, branch replay, canvas, AI scoring, and account sync remain available in the website.

## Refresh without losing work

```sh
npm run practice:generate
```

Refresh updates generated briefs, fixture files, references, datasets, `manifest.json`, and `INDEX.md` from the application source. Existing `solution.*` and `answer.md` files are preserved. Added exercises receive new starters; removed source exercises are not deleted from your disk. Keep custom notes/tests in separate files, because generated documentation and fixtures are refreshed. If an upstream starter changes, compare it in `exercise.json` before adapting your solution.

The generated pack is included with the project, so you can begin immediately after installing dependencies. Changes here do not patch the application, update cloud progress, or affect `npm test`. The app TypeScript configuration excludes this directory so unfinished practice code does not break website builds. Additional local tests can be written with Node's built-in test runner (`node --test path/to/your.test.cjs`) or your preferred language tooling.
