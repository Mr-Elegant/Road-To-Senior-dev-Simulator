# Enterprise Loan Management Dashboard (React & Redux Toolkit)

Collection: catalog · ID: `enterprise-loan-management` · Mode: **guided**

## Business context

An enterprise Non-Banking Financial Company (NBFC) manages high-volume loan applications across diverse risk tiers. Underwriters need an interactive dashboard to search, filter, paginate, sort, inspect credit profiles, and execute optimistic loan approvals or rejections with zero-drift rollback on network rejection.

## Task

Design and architect a production-grade enterprise dashboard powered by Redux Toolkit. You must structure domain slices (applications, dashboard, ui), implement asynchronous createAsyncThunk data fetching with AbortController cancellation and monotonic request-ID guards against race conditions, support optimistic status updates with atomic rollback snapshots, and optimize render performance using memoized createSelector selectors and React.memo.

## Candidate tasks

- Structure normalized Redux slices for applications, dashboard metrics, and UI state.
- Implement createAsyncThunk with AbortSignal cancellation and latestRequestId monotonic guards.
- Implement safe optimistic status updates with snapshot backups and atomic rollback on error.
- Reset pagination page index to 1 on filter and search updates.
- Prevent excessive re-renders using debounced search, React.memo rows, and memoized selectors.
- Handle error recovery with explicit retry actions.

## Constraints

- Older asynchronous search responses must never overwrite newer search queries.
- Optimistic updates must record pre-mutation snapshots and roll back atomically on API failure without corrupting concurrent rows.
- Filter and search mutations must reset the pagination page index to 1.
- Derived metrics must be computed via createSelector rather than duplicated in state.
- Component tree must use debounced inputs and React.memo to prevent keystroke render thrashing.

## Follow-up questions

- How would you scale this dashboard if the record count reached 100,000 active loan applications?

## Work locally

Edit [solution.ts](solution.ts) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
