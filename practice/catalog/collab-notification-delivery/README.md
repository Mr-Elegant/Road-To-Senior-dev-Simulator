# Collaboration: Deduplicate Notifications and Respect Preferences

Collection: catalog · ID: `collab-notification-delivery` · Mode: **javascript**

## Business context

A reconnect replay sends the same mention notification repeatedly, including muted channels and messages the recipient wrote.

## Task

Implement solution({ recipientId, mutedChannels, mentionsOnly, events }). Events are valid { id, authorId, channelId, mentionIds } with nonempty string IDs and arrays of string mentionIds. Process in arrival order. An already-seen event id => duplicate; first occurrences consume the ID even if suppressed. Then authorId==recipientId => self; muted channel => muted; mentionsOnly without recipient in mentionIds => skipped; otherwise delivered. Return { delivered: [event IDs], outcomes }. A replay with changed contents still uses the first event decision. No actual delivery is performed.

## Candidate tasks

- Reproduce the starter failure, implement the invariant, and pass every authored case.
- How would an outbox and provider idempotency key handle a crash after sending but before recording success?

## Constraints

- Implement the synchronous solution(input) contract exactly. Do not mutate input; all inputs are JSON data.
- This is a deterministic state model. It does not open sockets, send notifications, authorize real users, or establish media connections.

## Follow-up questions

- How would an outbox and provider idempotency key handle a crash after sending but before recording success?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/collab-notification-delivery
npm run practice:watch -- catalog/collab-notification-delivery
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
