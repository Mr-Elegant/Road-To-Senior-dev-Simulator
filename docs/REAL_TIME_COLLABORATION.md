# Real-Time Collaboration

Open `/enterprise-labs/real-time-collaboration` for the recommended sequence, or search **Collaboration:** in the Challenge Library. The eight exercises also appear in `practice/catalog/collab-*` with editable solutions, cases, references, and terminal/watch commands.

This is an enterprise **coding challenge collection** using a team messaging and meeting product as its context. It does not add a live Slack/Discord clone, WebSocket server, notification provider, or WebRTC call service. Existing app authentication, account-scoped history, rubric scoring, hints, and reference dialogs are reused.

## Learning sequence and contracts

| Exercise ID | Invariant | Cases |
|---|---|---:|
| `collab-message-ordering` | Deduplicate by message ID, reject conflicting IDs/sequences, enforce channel scope, and sort by server sequence | 7 |
| `collab-reconnect-cursor` | Replay strictly after acknowledgement; distinguish retention reset from an empty page | 7 |
| `collab-read-receipts` | Merge per-user receipts monotonically and derive unread from a bounded high-water mark | 7 |
| `collab-presence-expiry` | Resolve session revisions before lease expiry; aggregate multiple tabs without stale resurrection | 7 |
| `collab-channel-permissions` | Enforce authenticated tenant scope, private membership, explicit actions, admin management, and archived-send rules | 10 |
| `collab-notification-delivery` | First event decision wins; self/mute/mentions preferences precede delivery decisions | 7 |
| `collab-meeting-signaling` | Fence stale call generations, correlate answers, reject conflicting offers, and prevent closed-epoch resurrection | 9 |
| `collab-history-pagination` | Use an exclusive sequence cursor, filter channel scope, and preserve older pages across newer inserts | 7 |

**Total: 61 cases.** Every exercise has visible starter cases, additional edge cases, a reproducibly failing starter, a self-contained JavaScript reference function, production reasoning, hints, rubric, common mistakes, and follow-ups. The problem statement defines valid input assumptions and precedence; unsupported input shapes should not be inferred as tested behavior.

```sh
npm run practice:list -- collab
npm run practice:test -- catalog/collab-message-ordering
npm run practice:watch -- catalog/collab-message-ordering
npm run practice:test -- collab
```

Broken starters are expected to fail. Reference files are separate from candidate files. `npm run practice:generate` refreshes briefs and cases without overwriting existing solutions or answers.

## Model boundaries

- Messages and history use authoritative per-channel sequences, not wall-clock timestamps. History allows gaps; the reconnect model deliberately assumes a contiguous retained log.
- Reconnect reset returns a snapshot checkpoint; the fixture does not fetch or atomically produce the snapshot. That is a production integration responsibility.
- Receipts use a contiguous visible sequence model. Real unread counts may exclude hidden/deleted messages and require different projections.
- Presence snapshots have trusted shapes, stable session ownership, and monotonic revisions. Server clocks, heartbeat transport, TTL storage, and typing indicators are design follow-ups.
- Permission inputs represent trusted authentication/membership results. The exercise is not a real authorization endpoint or a guarantee of tenant isolation in deployed infrastructure.
- Notification results are delivery **decisions**, not provider acknowledgements. Deduplication is within the supplied batch; cross-batch durability/outbox delivery is a follow-up.
- Meeting signaling is a simplified epoch/offer state machine. It does not implement SDP, ICE candidates, media devices, glare handling, STUN/TURN, or browser-level WebRTC interoperability.

## Production architecture discussion

A production extension would authenticate socket subscriptions and HTTP history reads, persist messages under conversation-scoped uniqueness constraints, and atomically publish delivery work through an outbox. Versioned snapshots and replay cursors would recover disconnected clients; membership revocation would remove active subscriptions. Presence leases and per-device revisions would be separate from durable message history. A meeting service would authorize room participants and add WebRTC perfect negotiation and TURN connectivity, with browser integration tests.

Those are architecture follow-ups, not services introduced by this change. No database migration, new API, external credentials, or deployment infrastructure is required by the exercise pack.

## Verification

Verified on 3 November 2026: **273 app unit tests across 18 suites**, **68 local-workspace checks**, and **15 targeted Chromium journeys** passed. TypeScript, ESLint, and the production build passed. The browser run covers all eight new starters/references, the existing commerce/SaaS cases, editor/results layout, and four-project responsive navigation in both themes. [Actual project overview](screenshots/18_collaboration_project.png).

- `tests/unit/collaboration.test.ts` checks all references against complete expected structures with deeply frozen inputs, verifies registration, and confirms every starter has a failure.
- `tests/e2e/collaboration.spec.ts` checks mobile discovery plus actual Monaco edits and browser execution of all eight starters/references.
- `tests/practice/runner.test.cjs` automatically includes all eight new references; the local practice coverage check expects 73 catalog scenarios and 270 exercises overall.
- Existing Enterprise Labs tests cover the fourth project, 22 exercise links, shared progress, and responsive navigation.

The browser runner retains its existing evaluation and execution limits. Adding these fixtures does not give generic practice the loan lab's iframe/Worker isolation or make practice results tamper-proof.
