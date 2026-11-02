# Collaboration: Authorize Channel Reads and Sends

Collection: catalog · ID: `collab-channel-permissions` · Mode: **javascript**

## Business context

A guessed private-channel ID lets an authenticated user read another team’s messages. Archived channels also accept new sends.

## Task

Implement solution({ tenantId, channel, session, members, action }). channel has id, tenantId, private and archived booleans. session is null or { userId, tenantId, active }. members contains unique users with { userId, role:member|admin, active }. action outside read/send/manage => invalid_action first. Missing/inactive session or empty userId => unauthenticated. Session or channel tenant mismatch => forbidden. Private channels require active membership; manage always requires an active admin membership, including public channels. Fail these checks as forbidden. An authorized send to an archived channel => read_only. Otherwise allow. Return { allowed, reason } with reason allowed for success. Inputs otherwise have valid shapes.

## Candidate tasks

- Reproduce the starter failure, implement the invariant, and pass every authored case.
- How would you revoke an active socket subscription immediately when channel membership changes?

## Constraints

- Implement the synchronous solution(input) contract exactly. Do not mutate input; all inputs are JSON data.
- This is a deterministic state model. It does not open sockets, send notifications, authorize real users, or establish media connections.

## Follow-up questions

- How would you revoke an active socket subscription immediately when channel membership changes?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/collab-channel-permissions
npm run practice:watch -- catalog/collab-channel-permissions
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
