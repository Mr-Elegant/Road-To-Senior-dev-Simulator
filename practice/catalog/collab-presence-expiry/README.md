# Collaboration: Expire Presence Without Disconnecting Other Tabs

Collection: catalog · ID: `collab-presence-expiry` · Mode: **javascript**

## Business context

Closing one browser tab marks a user offline despite another active tab. Delayed heartbeats also resurrect disconnected sessions.

## Task

Implement solution({ now, sessions }). now is a nonnegative safe integer. Each valid snapshot has nonempty id/userId, nonnegative safe-integer version and expiresAt, and boolean online. Snapshots may arrive out of order. For each session id retain the highest version; equal-version first arrival wins. All versions of one session id belong to the same user. A retained session is active iff online and expiresAt > now. Return { onlineUsers, activeSessions }, where onlineUsers contains unique user IDs in ascending JavaScript string order. Empty sessions gives empty users and zero active sessions.

## Candidate tasks

- Reproduce the starter failure, implement the invariant, and pass every authored case.
- How would you implement leases, typing-indicator expiry, and disconnect tombstone retention across presence servers?

## Constraints

- Implement the synchronous solution(input) contract exactly. Do not mutate input; all inputs are JSON data.
- This is a deterministic state model. It does not open sockets, send notifications, authorize real users, or establish media connections.

## Follow-up questions

- How would you implement leases, typing-indicator expiry, and disconnect tombstone retention across presence servers?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/collab-presence-expiry
npm run practice:watch -- catalog/collab-presence-expiry
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
