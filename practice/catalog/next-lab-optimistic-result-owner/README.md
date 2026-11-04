# Ignore stale mutation results in an optimistic UI

Collection: catalog · ID: `next-lab-optimistic-result-owner` · Mode: **frontend-js**

## Business context

Implement a deterministic application policy used around a Next.js request boundary. The Worker executes your policy function, not a Next.js server.

## Task

Implement solution(input). Input {current,pendingId,result:{id,ok,value}}. pendingId is string or null, result.id is string. If IDs differ, return {value:current,pendingId} unchanged. If equal, clear pendingId and use result.value on success or retain current on failure.

## Candidate tasks

- Implement the policy and trace every boundary case.
- Explain where this function would run in a Next.js application and which checks remain server-side.
- Answer the interview variation without changing the base contract.

## Constraints

- Return exactly the documented JSON value, including every field.
- Do not mutate input. Inputs follow the shapes described in the task.
- These tests do not establish RSC rendering, cache invalidation, distributed concurrency or server authorization.

## Follow-up questions

- What if two different items mutate concurrently?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/next-lab-optimistic-result-owner
npm run practice:watch -- catalog/next-lab-optimistic-result-owner
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.

## Next.js version and verification scope

Mode: **policy**.

Next.js 15: Use patched Next.js 15 and the router family named by the file path. Await request APIs where the App Router contract requires it; validate behavior in a production build.

Next.js 16: Applies to Next.js 16.4.5. Cache Components is disabled unless the exercise explicitly enables it. The simulator itself remains on 16.4.3.

### Acceptance evidence

- Run every exact-result case.
- Run the same policy at its real request boundary and test forged/untrusted inputs separately.

### Official references

- [Topic documentation](https://nextjs.org/docs/app/getting-started/mutating-data)
- [Next.js 15 documentation](https://nextjs.org/docs/15)
- [Next.js 15 migration](https://nextjs.org/docs/app/guides/upgrading/version-15)
- [Next.js 16 migration](https://nextjs.org/docs/app/guides/upgrading/version-16)

Framework reviews and architecture work need real-server/manual evidence, not a manufactured browser test pass.
