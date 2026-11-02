# AI Streaming Assistant Suspense & Localized Error Boundary Fallback

Collection: catalog · ID: `nextjs-stream-suspense-error-boundary` · Mode: **guided**

## Business context

A customer support portal embeds an AI conversational assistant in the sidebar. If the external LLM streaming endpoint times out or errors with a 503, the entire Next.js page currently crashes with an unhandled server error, locking out agents from viewing customer tickets.

## Task

Restructure the page using Next.js App Router streaming architecture with React `<Suspense>` and nested localized `error.tsx` / `<ErrorBoundary>` components. The ticket details must render immediately, the AI assistant must stream in progressively, and an AI failure must show a retry card inside the sidebar without affecting the main ticket view.

## Candidate tasks

- Explain how React Suspense and HTTP Chunked Transfer Encoding enable Progressive Hydration in Next.js.
- Wrap slow AI component in `<Suspense fallback={<AiSkeleton />}>`.
- Implement localized Error Boundary around sidebar so AI timeouts never crash ticket view.

## Constraints

- Main page ticket data must render with 0 delay (not blocked by AI stream).
- AI assistant must stream chunk by chunk inside Suspense boundary.
- LLM error must be caught locally inside the sidebar component boundary.

## Follow-up questions

- What HTTP response headers enable streaming in Next.js Server Components?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
