# Migrate a critical image loading hint with measured intent

Collection: catalog · ID: `next-lab-image-preload-16` · Mode: **guided**

## Business context

Review a focused Next.js application change before it reaches production. The proposed file below contains the defect or unsupported assumption; external application services, where imported, are integration boundaries.

## Task

Review the proposed app/hero.tsx change. Identify the incorrect framework assumption, propose a minimal corrected implementation, and provide evidence for the selected version scope and its 15/16 differences. Explain the interview variation after solving the base task. This is a framework code review: actual rendering, routing and cache behavior must be checked in a real Next.js build, not a browser function sandbox.

## Candidate tasks

- Add actionable line-level review comments explaining impact and correction.
- Write the corrected file in the local IDE copy; split annotated companion files where instructed.
- Record actual build/request/navigation evidence against the acceptance checks and compare version notes.

## Constraints

- Preserve the stated user behavior and keep trust boundaries explicit.
- Use the selected version’s documented API; do not suppress build/type failures to hide the defect.
- Inspect the head preload and image request in a production build.
- Compare LCP and bandwidth on a small viewport.
- Verify below-the-fold images do not all receive the same critical hint.

## Follow-up questions

- What if the hero depends on a user preference?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.

## Next.js version and verification scope

Mode: **framework-review**. Edit the proposed file under working/ and record findings in answer.md; compare reference-files/ only after attempting it.

Next.js 15: Use the documented priority behavior for a deliberate critical image. Do not combine an intended eager critical resource with lazy loading.

Next.js 16: priority is deprecated in favor of the current loading guidance including preload. Choose preload/fetchPriority/loading deliberately and avoid competing hints.

### Acceptance evidence

- Inspect the head preload and image request in a production build.
- Compare LCP and bandwidth on a small viewport.
- Verify below-the-fold images do not all receive the same critical hint.

### Official references

- [Topic documentation](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js 15 documentation](https://nextjs.org/docs/15)
- [Next.js 15 migration](https://nextjs.org/docs/app/guides/upgrading/version-15)
- [Next.js 16 migration](https://nextjs.org/docs/app/guides/upgrading/version-16)

Framework reviews and architecture work need real-server/manual evidence, not a manufactured browser test pass.
