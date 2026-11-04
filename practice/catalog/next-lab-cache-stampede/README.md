# Protect the origin during cold-cache and invalidation storms

Collection: catalog · ID: `next-lab-cache-stampede` · Mode: **guided**

## Business context

Every instance recomputes an expensive dashboard simultaneously after a broad invalidation.

## Task

Design the system for 10,000 requests/second; a shared homepage cache expires during a deploy. Produce the component/data-flow diagram, request and mutation contracts, cache/trust boundaries, capacity assumptions, failure recovery and rollout gates. State which decisions change between Next.js 15 and 16 instead of using a framework API as a substitute for an architectural guarantee.

## Candidate tasks

- Draw components and annotate ownership of data, identity, caches and durable work.
- Specify contracts/schema and quantify the capacity/freshness assumptions.
- Walk through the failure scenario and design measurable acceptance tests.
- Compare the reference decisions and answer the changed-requirement interview prompt.

## Constraints

- Bound concurrent origin work.
- Keep freshness and fairness explicit.
- Avoid cache locks becoming a permanent failure mode.

## Follow-up questions

- Can a very long TTL solve the incident?

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

- Send a synchronized cold burst across multiple instances.
- Kill the refresh owner and verify eventual progress.
- Trigger narrow and broad invalidations while measuring database connections and p99 latency.

### Official references

- [Topic documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers)
- [Next.js 15 documentation](https://nextjs.org/docs/15)
- [Next.js 15 migration](https://nextjs.org/docs/app/guides/upgrading/version-15)
- [Next.js 16 migration](https://nextjs.org/docs/app/guides/upgrading/version-16)

Framework reviews and architecture work need real-server/manual evidence, not a manufactured browser test pass.
