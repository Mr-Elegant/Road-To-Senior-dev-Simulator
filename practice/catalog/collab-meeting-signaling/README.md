# Collaboration: Reject Stale Meeting Signaling After Reconnect

Collection: catalog · ID: `collab-meeting-signaling` · Mode: **javascript**

## Business context

A delayed disconnect from an old call ends a new meeting. Conflicting offers and early answers corrupt the signaling state.

## Task

Implement solution({ epoch, phase, offerId, events }). Initial phase is idle/offered/connected/closed; idle has null offerId, other phases have a nonempty offerId. Events have unique-or-replayed nonempty id, nonnegative safe-integer epoch, and type offer/answer/disconnect. Offer/answer have nonempty offerId. All shapes are valid. First deduplicate event IDs within this batch, consuming them even when rejected. Lower epoch => stale. Higher epoch accepts only an offer, replacing state with offered; other types => unexpected. At the current epoch: idle accepts an offer; offered/connected with same offerId => duplicate, different => conflict; closed rejects offers as unexpected. A matching answer changes offered to connected, or is duplicate if already connected; otherwise unexpected. Disconnect changes offered/connected to closed (preserve offerId), returns duplicate if already closed, and is unexpected while idle. Return { epoch, phase, offerId, outcomes }. No SDP, WebRTC negotiation, or media is executed.

## Candidate tasks

- Reproduce the starter failure, implement the invariant, and pass every authored case.
- How would you add perfect negotiation, ICE restart, TURN fallback, and participant authorization to a real meeting service?

## Constraints

- Implement the synchronous solution(input) contract exactly. Do not mutate input; all inputs are JSON data.
- This is a deterministic state model. It does not open sockets, send notifications, authorize real users, or establish media connections.

## Follow-up questions

- How would you add perfect negotiation, ICE restart, TURN fallback, and participant authorization to a real meeting service?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/collab-meeting-signaling
npm run practice:watch -- catalog/collab-meeting-signaling
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
