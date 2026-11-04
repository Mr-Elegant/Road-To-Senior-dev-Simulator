# React + TypeScript practice

Open `/react-typescript` for **113 separate TSX exercises**: 39 easy, 60 medium and 14 hard. Each is a typed copy of an existing React practice topic. The original 203-topic React/JavaScript bank remains at `/frontend-practice`.

Every copy has a `react-ts-<topic-slug>` scenario ID, a typed starter, a complete typed reference, the original specification and DOM cases, hints, follow-ups, and independent saved attempts and bookmarks. The copies reuse **379 behavioral cases**; they are additional exercises on the same topics, rather than 113 newly researched topics.

## Browser workflow

1. Search or filter the module, then open an exercise. Edit `solution.tsx` in Monaco.
2. Preserve the exported `AppProps` contract and default-exported `App`. Use React hooks and TSX; only `react` and `react/jsx-runtime` imports are available.
3. **Run Tests** first performs strict TypeScript semantic checking, then mounts a fresh opaque-origin iframe per DOM journey. Type errors fail the run before candidate code executes. Preview also requires a successful type check.
4. Fix diagnostics for props, state updates, handlers, refs, nullable values or unknown errors, then rerun. Explicit `any` and type-check suppression directives are rejected in this track.
5. Submit the current tested code. Saved scores use the actual passed-case percentage and the new copy's scenario ID. Closing results or preview restores the full editor height.

State inference is encouraged where sufficient; annotations and domain interfaces handle empty collections, nullable refs, recursive trees and discriminated states. Runtime input validation is still necessary: TypeScript does not validate arbitrary form text or external JSON.

## Local IDE workflow

```sh
npm ci
npx playwright install chromium
npm run react:runtime
npm run practice:list -- react-ts
npm run practice:test -- catalog/react-ts-progress-bar
npm run practice:watch -- catalog/react-ts-progress-bar
```

Edit `practice/catalog/react-ts-progress-bar/solution.tsx`. Each folder includes its specification, fixtures, exported `AppProps`, reference TSX and explanation. The CLI uses the same strict checker before its Chromium DOM runner. The local test result never updates website history. Next.js, the account database, environment files and login are unnecessary for local practice. Generation preserves existing solutions and notes.

`practice/tsconfig.json` gives VS Code a separate strict TSX project for these solutions and references. Unfinished local work remains excluded from the application build. The CLI additionally enforces this track's explicit-any and suppression rules.

## Architecture

- `src/data/reactTypescript/references.json` holds the authored TSX references and starters. The registry copies the original topic contracts and journeys and assigns independent IDs. Changes to original behavior require reviewing the typed references and rerunning their cases.
- `src/lib/reactTypescript/check.ts` uses the installed TypeScript compiler's language service with an in-memory filesystem, React/CSS declarations, strict options and an import allowlist. It parses and checks candidate code; it never evaluates it or reads arbitrary machine files.
- `scripts/build-react-typescript-runtime.mjs` creates a self-hosted compiler Worker, declaration bundle and dependency license notices. A local cache tracks dependency paths, sizes and modification times, including generated outputs, so unchanged assets skip compiler reads and bundling. Missing or changed assets are regenerated before development, production builds and local runtime setup. Generated assets and cache manifests are ignored by Git. No remote compiler service is used.
- The browser loads the compiler when running tests or previewing TSX. Its Worker has a 15-second deadline and is terminated on completion, cancellation or error. Monaco loads the self-hosted React declarations for TSX editing.
- After type checking, the existing self-hosted Sucrase/React runtime removes TypeScript syntax and runs the component in an opaque-origin DOM iframe. Original JSX exercises retain their original transform mode.

The existing DOM runner's eight-second response deadline cannot forcibly interrupt a synchronous infinite loop in a DOM frame. This remains an educational practice environment with visible fixtures, rather than hostile-code isolation or tamper-proof grading. A type-correct solution can still fail behavioral tests; passing authored cases does not prove complete production behavior.

## Verification

The unit suite checks exact 113-topic coverage, separate IDs, preservation of all 379 journeys, strict reference/starter compilation, and compatibility of every fixture with `AppProps`. Browser coverage exercises all typed references and starters, compiler errors, preview, route resolution, independent progress, responsive layout, and existing JSX regressions. Local exports are included in the source-driven workspace checks.

Verified locally on 4 November 2026: **491 unit tests across 24 suites passed**. All 113 typed references passed **379 DOM cases**, and every starter failed its full suite. **29 targeted browser journeys were verified** against the final production build: 28 passed together; one desktop-layout check passed in a focused rerun with a 60-second startup budget after a cold editor-load timeout. The production build, TypeScript checks and ESLint passed. Three representative local TSX reference suites and catalog/preservation checks passed. Desktop module and editor/preview screenshots were inspected. No deployment or push was performed.

The isolated local IDE project also passed `tsc -p practice/tsconfig.json`; both workspace checks passed again after adding that configuration, confirming all 586 exports and preservation on refresh.
