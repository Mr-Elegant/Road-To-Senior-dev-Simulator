# Migrate dynamic route params from 15 compatibility to 16

Collection: catalog · ID: `next-lab-async-route-params` · Mode: **guided**

## Business context

Review a focused Next.js application change before it reaches production. The proposed file below contains the defect or unsupported assumption; external application services, where imported, are integration boundaries.

## Task

Review the proposed app/products/[id]/page.tsx change. Identify the incorrect framework assumption, propose a minimal corrected implementation, and provide evidence for the selected version scope and its 15/16 differences. Explain the interview variation after solving the base task. This is a framework code review: actual rendering, routing and cache behavior must be checked in a real Next.js build, not a browser function sandbox.

## Candidate tasks

- Add actionable line-level review comments explaining impact and correction.
- Write the corrected file in the local IDE copy; split annotated companion files where instructed.
- Record actual build/request/navigation evidence against the acceptance checks and compare version notes.

## Constraints

- Preserve the stated user behavior and keep trust boundaries explicit.
- Use the selected version’s documented API; do not suppress build/type failures to hide the defect.
- Build a dynamic route and directly request /products/abc.
- Verify generated route types accept the promised params signature.
- Test a missing resource separately from an invalid identifier.

## Follow-up questions

- What changes for Route Handlers and metadata?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.

## Next.js version and verification scope

Mode: **framework-review**. Edit the proposed file under working/ and record findings in answer.md; compare reference-files/ only after attempting it.

Next.js 15: Next.js 15 introduces promised params with temporary synchronous compatibility. Migrate callers and types instead of relying on that compatibility.

Next.js 16: Synchronous params access is removed. Await the promise, or unwrap with React use in an appropriate synchronous component.

### Acceptance evidence

- Build a dynamic route and directly request /products/abc.
- Verify generated route types accept the promised params signature.
- Test a missing resource separately from an invalid identifier.

### Official references

- [Topic documentation](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js 15 documentation](https://nextjs.org/docs/15)
- [Next.js 15 migration](https://nextjs.org/docs/app/guides/upgrading/version-15)

Framework reviews and architecture work need real-server/manual evidence, not a manufactured browser test pass.
