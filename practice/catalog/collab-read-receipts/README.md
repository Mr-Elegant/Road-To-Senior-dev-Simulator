# Collaboration: Keep Read Receipts Monotonic Across Devices

Collection: catalog · ID: `collab-read-receipts` · Mode: **javascript**

## Business context

An old mobile receipt arrives after a desktop receipt and increases the unread badge. Another user’s receipt is mistakenly applied locally.

## Task

Implement solution({ userId, lastRead, highWater, updates }). lastRead/highWater are safe integers with 0 <= lastRead <= highWater. Each update is an object. A nonmatching userId => forbidden before validation. For this user, sequence must be a safe integer in [0,highWater], otherwise invalid. sequence <= current lastRead => stale; otherwise advance and return advanced. Return { lastRead, unread:highWater-lastRead, outcomes }. Empty updates leave the receipt unchanged.

## Candidate tasks

- Reproduce the starter failure, implement the invariant, and pass every authored case.
- How would you atomically merge read positions across devices while excluding messages the recipient cannot see?

## Constraints

- Implement the synchronous solution(input) contract exactly. Do not mutate input; all inputs are JSON data.
- This is a deterministic state model. It does not open sockets, send notifications, authorize real users, or establish media connections.

## Follow-up questions

- How would you atomically merge read positions across devices while excluding messages the recipient cannot see?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/collab-read-receipts
npm run practice:watch -- catalog/collab-read-receipts
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
