# Hands-on loan dashboard bug lab

Open `/challenges/loan-management` and choose **Start bug-fixing lab**, or open `/challenges/loan-management?bug=bug-1-race-condition` directly. Sign-in uses the existing protected dashboard route.

## Using the lab

1. Select an exercise from the desktop list or mobile picker. Read its observed failure and function contract.
2. Run the deliberately broken starter with **Run sample tests**. Two sample cases show the failure with expected/actual output and runtime errors.
3. Edit the JavaScript function in Monaco, then rerun samples. Inputs are frozen and outputs are compared structurally: object property order is irrelevant, array order matters, and substring matches do not pass.
4. Choose **Submit fix** to run the complete exercise suite and record the code, test outcome, duration and assistance in Progress. Account sync uses the existing background queue; sync failures retain the local attempt and use the existing retry notice.
5. Reveal progressive hints as needed. **Reveal reference fix** shows executable reference code and the Redux adaptation example. **Load reference into editor** permits trying that implementation; submissions after reference reveal remain marked assisted.
6. Reset restores starter code while preserving recorded best submissions and assistance history. Editing clears old test feedback. Closing or switching an exercise cancels incomplete work. Draft code, elapsed visible-tab time, hints and reference attribution restore across refresh and exercise switches.

| Bug | Editable entry point | Full-suite cases |
|---|---|---:|
| Stale search response | `reduceSearch(state, action)` | 5 |
| Duplicate in-flight query | `shouldFetch(active, next)` | 6 |
| Optimistic rollback | `reduceApproval(state, action)` | 6 |
| Query/pagination mismatch | `updateQuery(state, change)` | 5 |
| State mutation while sorting | `sortLoans(items, sorting)` | 5 |
| Selector reference churn | `createLoanSelector()` | 5 |
| Stale refresh closure | `createRefresh(getState, send)` | 4 |
| Failed request recovery | `reduceRequest(state, action)` | 5 |

There are 41 authored behavioral cases. These exercises evaluate extracted JavaScript logic using deterministic event sequences and reference checks. They do not execute a complete React/Redux application or modify the working demonstration dashboard.

## Execution and persistence

Each case gets a fresh Worker inside a disposable iframe with `sandbox="allow-scripts"` and no same-origin permission. Candidate text is sent as data over a private MessageChannel; it is not inserted into the iframe HTML. The iframe CSP permits the local worker/evaluation bootstrap and blocks network connections and external script loading. Worker termination limits each case to 1,500 ms; a 5-second parent watchdog handles runner initialization or transport failures. Code is bounded to 100,000 characters, serialized output to 64 KB, and console capture to 20 lines of 500 characters. Cancellation and navigation remove the frame, ports and worker resources.

The browser owns practice results; this is not tamper-proof examination infrastructure. A worker timeout is not a hard browser heap quota. No candidate code is executed by an API route or the Next.js server. Unit tests use Node VM only for trusted authored starters/reference implementations.

Device drafts use `fullstack_loan_lab_v1:<bugId>` with the existing `:user:<accountId>` scope. Draft validation rejects malformed, oversized or stale records and never restores cached grades. Completed submissions use existing attempt fields and `scenarioId=loan-lab:<bugId>`, with `loanLab.version`, `loanLab.mode` and `loanLab.assisted` entries in `interviewAnswers`. Progress and recent-history links reopen the correct exercise. Best full-suite scores remain independent of the current editor draft.

Loan exercise attempts stay in the general activity history. Catalog completion/average and senior readiness calculations now include only registered scenario IDs, so a loan test score does not count as a completed senior scenario or inflate that score average. Practice streak behavior is unchanged.

## Scope

At `/challenges/loan-management`, add eight editable JavaScript exercises matching the eight existing bug explanations. Each exercise extracts a real dashboard concern into a documented function contract: search response ordering, duplicate request admission, optimistic rollback, pagination reset, immutable sorting, selector memoization, fresh refresh callbacks and failed-request recovery. The live dashboard remains the working demonstration; candidate functions run against isolated fixtures.

## Acceptance criteria and implementation order

1. Author deliberately broken starters, runnable reference fixes, at least two sample tests and additional edge tests for each exercise. Test actual outputs, immutability and reference identity rather than matching code strings. Async races use deterministic event sequences.
2. Run each test in a disposable Worker inside an opaque-origin iframe (`sandbox="allow-scripts"`). The frame/worker has a restrictive CSP blocking network access. Candidate code never executes in the application window or server. Bound code/output/log size, enforce worker termination on timeout, support cancellation, and clean up on completion/navigation.
3. Add a Monaco editor, contract, sample/full-suite actions, pass/fail feedback with expected/actual results, reset, and explicit reference reveal. Changing code invalidates old feedback. Reveal/load marks assisted attempts. A submitted full run stores code, outcome, timing and assistance attribution through the existing progress API.
4. Store per-account exercise drafts on this device, restore across refresh/switch, reject invalid drafts, and preserve prior best submissions separately from the current draft. Closing or switching exercises cancels active work; no stale results may be saved under another exercise/account.
5. Expose a clear Start bug-fixing lab entry point, all eight challenges, completion counts, and useful progress-history labels/links. Keep dashboard operations, interview mode and prior incident work intact.
6. Verify failing starters and passing reference fixes with Vitest using trusted authored code in Node VM fixtures. Verify real worker isolation, timeouts/cancellation, Monaco edits, account persistence, draft restore and responsive use with Playwright. Run all unit tests, lint, type checking and a Turbopack production build.

No new dependencies, database columns, external code-execution service, authentication changes or production loan operations are needed. Browser practice scores remain client-reported learning feedback, not tamper-proof certification. The exercises evaluate extracted JavaScript logic rather than arbitrary React component rendering or a complete Redux installation.

## Commands

```sh
npm test
npm run typecheck
npm run lint
node scripts/auth-check.mjs build
node scripts/auth-check.mjs serve
```

Run browser checks against the verification server with `PLAYWRIGHT_BASE_URL=http://localhost:3100` and `PLAYWRIGHT_EXTERNAL_SERVER=1`, using `node node_modules/@playwright/test/cli.js test --workers=1`.

## Technical references

- [Iframe sandbox restrictions](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#sandbox)
- [Worker CSP inheritance and termination](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [Private MessageChannel communication](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel)
- [Redux selector memoization](https://redux.js.org/usage/deriving-data-selectors)

## Verification results (2 November 2026)

- All **137 unit tests across 15 suites** passed. The 16 new tests verify all eight failing starters, all 41 passing reference cases, strict structural comparison, draft validation, progress labels, best-score retention and the senior-readiness boundary. The readiness regression failed before its fix: one loan result incorrectly produced 46/100 senior readiness despite no catalog attempt.
- The final **Next.js 16.4.3 Turbopack production build**, its TypeScript check, standalone type checking and ESLint passed.
- All **28 Playwright tests passed against the final production build**. The five loan lab journeys cover native Monaco editing, sample/full-suite grading, code persistence, reference attribution, all eight executable fixes, two-account draft isolation, best-score retention after reset, working history deep links, timeout and cancellation cleanup, cancellation on exercise switching, syntax-error recovery, opaque worker DOM/storage restrictions, blocked external script loading and mobile exercise switching. Existing auth, SQL engines, coding, evolving incidents, interviews and loan-dashboard behavior also passed.
- The five loan lab journeys passed against the existing development server. Screenshots were inspected for desktop and mobile layouts. A compact picker avoids pushing the mobile editor below eight full exercise cards.
- Browser tests focus Monaco's accessible Editor content control rather than assuming a textarea; Chrome's EditContext input can add indentation/brackets to synthetic multiline typing. The security probe uses equivalent single-line source and verifies the saved code before execution.
- No environment, dependency/lockfile, database schema or migration changes were made. Disposable fixture accounts were removed; the legacy default-user record and its zero historical attempts remained unchanged. The verification server was temporary; the user's development server was left running.

The final production client scan checked 42 JavaScript files and found none of the configured server-secret values. Four disposable accounts left by earlier timed-out browser runs were inspected and removed by exact ID, generated email and fixture name; the final disposable-account count is zero.

The existing missing favicon 404 is unrelated to this change. External Gemini responses remain mocked in regression journeys; they are not part of loan-code grading.
