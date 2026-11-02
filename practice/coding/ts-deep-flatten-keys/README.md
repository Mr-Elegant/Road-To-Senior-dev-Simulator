# Deep Nested Object Path Keys Union Type

Collection: coding · ID: `ts-deep-flatten-keys` · Mode: **javascript**

## Task

Create a recursive TypeScript utility type `PathKeys<T>` that generates a union of all dot-separated object path strings for a deeply nested object interface.

Example:
```typescript
interface Config {
  server: { host: string; port: number };
  db: { primary: { url: string } };
}
type Keys = PathKeys<Config>;
// Result: "server" | "server.host" | "server.port" | "db" | "db.primary" | "db.primary.url"
```

## Constraints

- Must recursively traverse nested object properties.
- Must handle primitive leaves without appending trailing dots.
- Must work for interfaces with 3+ levels of nesting.

## Work locally

Edit [solution.ts](solution.ts) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- coding/ts-deep-flatten-keys
npm run practice:watch -- coding/ts-deep-flatten-keys
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
