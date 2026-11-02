# Collaboration: Resume a Conversation After Disconnection

Collection: catalog · ID: `collab-reconnect-cursor` · Mode: **javascript**

## Business context

A laptop reconnects after a long outage. Blindly replaying the latest page loses messages, while an expired cursor silently hides history.

## Task

Implement solution({ cursor, highWater, retainedFrom, limit, events }). Inputs are valid safe integers: 0 <= cursor, 0 <= highWater, 1 <= retainedFrom <= highWater+1, limit >= 1. events is the ascending contiguous retained log with seq retainedFrom through highWater. Return { status, events, nextCursor, hasMore }. cursor > highWater => invalid_cursor with empty events and unchanged cursor. cursor < retainedFrom-1 => reset with empty events and nextCursor=highWater; obtain a separate snapshot before continuing. Otherwise return up to limit events strictly after cursor, status ok, nextCursor=last returned seq or cursor, hasMore=nextCursor<highWater. Error/reset hasMore is false.

## Candidate tasks

- Reproduce the starter failure, implement the invariant, and pass every authored case.
- How would you atomically capture a snapshot/high-water pair and handle a connection dropping before acknowledgement?

## Constraints

- Implement the synchronous solution(input) contract exactly. Do not mutate input; all inputs are JSON data.
- This is a deterministic state model. It does not open sockets, send notifications, authorize real users, or establish media connections.

## Follow-up questions

- How would you atomically capture a snapshot/high-water pair and handle a connection dropping before acknowledgement?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/collab-reconnect-cursor
npm run practice:watch -- catalog/collab-reconnect-cursor
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
