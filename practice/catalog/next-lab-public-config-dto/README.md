# Project a browser-safe configuration DTO

Collection: catalog · ID: `next-lab-public-config-dto` · Mode: **frontend-js**

## Business context

Implement a deterministic application policy used around a Next.js request boundary. The Worker executes your policy function, not a Next.js server.

## Task

Implement solution(input). Input {publishableKey,currency,secretKey,...}. Return only {publishableKey,currency}. A publishableKey string must start pk_; otherwise null. Currency must be exactly three uppercase letters; otherwise USD. Never copy unknown fields.

## Candidate tasks

- Implement the policy and trace every boundary case.
- Explain where this function would run in a Next.js application and which checks remain server-side.
- Answer the interview variation without changing the base contract.

## Constraints

- Return exactly the documented JSON value, including every field.
- Do not mutate input. Inputs follow the shapes described in the task.
- These tests do not establish RSC rendering, cache invalidation, distributed concurrency or server authorization.

## Follow-up questions

- Does server-only make an unsafe DTO safe?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/next-lab-public-config-dto
npm run practice:watch -- catalog/next-lab-public-config-dto
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

- [Topic documentation](https://nextjs.org/docs/app/guides/data-security)
- [Next.js 15 documentation](https://nextjs.org/docs/15)
- [Next.js 15 migration](https://nextjs.org/docs/app/guides/upgrading/version-15)
- [Next.js 16 migration](https://nextjs.org/docs/app/guides/upgrading/version-16)

Framework reviews and architecture work need real-server/manual evidence, not a manufactured browser test pass.
