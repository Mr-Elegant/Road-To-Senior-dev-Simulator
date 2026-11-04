# Separate a cached storefront from authoritative checkout

Collection: catalog · ID: `next-lab-commerce-consistency` · Mode: **guided**

## Business context

A fast cached product page is being used as proof that an item is still available when payment begins.

## Task

Design the system for 50,000 visitors/minute during a launch; inventory must never go negative. Produce the component/data-flow diagram, request and mutation contracts, cache/trust boundaries, capacity assumptions, failure recovery and rollout gates. State which decisions change between Next.js 15 and 16 instead of using a framework API as a substitute for an architectural guarantee.

## Candidate tasks

- Draw components and annotate ownership of data, identity, caches and durable work.
- Specify contracts/schema and quantify the capacity/freshness assumptions.
- Walk through the failure scenario and design measurable acceptance tests.
- Compare the reference decisions and answer the changed-requirement interview prompt.

## Constraints

- Keep product browsing fast.
- Reserve stock atomically with bounded expiry.
- Handle payment timeouts without duplicate charges.

## Follow-up questions

- Can optimistic UI mark the order paid?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.

## Next.js version and verification scope

Mode: **architecture**.

Next.js 15: Use patched Next.js 15 and the router family named by the file path. Await request APIs where the App Router contract requires it; validate behavior in a production build.

Next.js 16: Applies to Next.js 16.4.5. Cache Components is disabled unless the exercise explicitly enables it. The simulator itself remains on 16.4.3.

### Acceptance evidence

- Race many buyers for the last unit in real database integration tests.
- Crash between reservation, outbox delivery and provider response.
- Replay provider webhooks and verify exactly-once business effects through constraints, not process memory.

### Official references

- [Topic documentation](https://nextjs.org/docs/app/guides/backend-for-frontend)
- [Next.js 15 documentation](https://nextjs.org/docs/15)
- [Next.js 15 migration](https://nextjs.org/docs/app/guides/upgrading/version-15)
- [Next.js 16 migration](https://nextjs.org/docs/app/guides/upgrading/version-16)

Framework reviews and architecture work need real-server/manual evidence, not a manufactured browser test pass.
