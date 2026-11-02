# Type-Safe RPC/REST Client with Path Parameter Inference

Collection: catalog · ID: `ts-generics-api-client` · Mode: **guided**

## Business context

A microservices ecosystem requires an internal SDK. Frontend engineers frequently write typos in URL routes like `/users/:userId/orders/:orderId` or pass wrong query parameters, resulting in 404s and missing request bodies that only surface in production.

## Task

Design a generic TypeScript utility type `ExtractRouteParams<TPath>` that extracts route param names from a template string like `"/orgs/:orgId/repos/:repoId"` into a strongly typed object `{ orgId: string; repoId: string }`. Build a typed client interface ensuring paths and parameters match at compile time.

## Candidate tasks

- Implement `ExtractRouteParams<T>` using template literal types, conditional types, and recursion.
- Handle trailing slashes and multi-param paths.
- Ensure the `params` argument is required if parameters exist, and optional if the route has no parameters.

## Constraints

- Must recursively infer all `:param` tokens from any route string.
- Routes without params must yield an empty object or void.
- Path and param arguments must be validated at compile time with zero runtime overhead.

## Follow-up questions

- How do you prevent type-level recursion limit errors when writing complex generic parsers?

## Work locally

Edit [solution.ts](solution.ts) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
