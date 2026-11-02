# Reference: Collaboration: Deduplicate Notifications and Respect Preferences

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "codeOrArtifact": "function solution({recipientId,mutedChannels,mentionsOnly,events}) {\n  const seen = new Set(), muted = new Set(mutedChannels), delivered=[];\n  const outcomes = events.map(e=>{\n    if(seen.has(e.id)) return 'duplicate'; seen.add(e.id);\n    if(e.authorId===recipientId) return 'self';\n    if(muted.has(e.channelId)) return 'muted';\n    if(mentionsOnly && !e.mentionIds.includes(recipientId)) return 'skipped';\n    delivered.push(e.id); return 'delivered';\n  });\n  return {delivered,outcomes};\n}",
    "explanation": "Record the event decision before evaluating preferences so replay cannot turn a suppressed event into a new notification. Keep first-event ordering and apply self/mute rules before mentions. Production needs a durable recipient-event idempotency key and transactional outbox, plus a separate acknowledgement/retry policy for the external delivery provider.",
    "architectureNotes": "How would an outbox and provider idempotency key handle a crash after sending but before recording success? Production implementations additionally need durable state, authenticated scope, observability, and a tested recovery/rollback plan. In-memory fixtures do not establish distributed-system guarantees."
  },
  "rubric": [
    {
      "id": "collab-notification-delivery-correctness",
      "category": "correctness",
      "weight": 5,
      "label": "Business invariant and edge cases",
      "description": "Correctly handle retries, ordering, boundaries, and unauthorized/stale events using the stated contract.",
      "levels": [
        {
          "score": 0,
          "description": "The original failure remains or the response is hard-coded."
        },
        {
          "score": 1,
          "description": "Happy path works; negative or replay cases fail."
        },
        {
          "score": 2,
          "description": "All fixture behaviors work, but production boundaries are unexplained."
        },
        {
          "score": 3,
          "description": "All fixture behaviors work and the business invariant is explained."
        }
      ]
    },
    {
      "id": "collab-notification-delivery-production",
      "category": "reliability",
      "weight": 4,
      "label": "Production design and verification",
      "description": "Separate this deterministic model from durable storage, concurrency, authorization, and recovery requirements.",
      "levels": [
        {
          "score": 0,
          "description": "Treats an in-memory model as a production guarantee."
        },
        {
          "score": 1,
          "description": "Names a production risk without a concrete mitigation."
        },
        {
          "score": 2,
          "description": "Defines persistence and failure handling, but omits a verification or rollback plan."
        },
        {
          "score": 3,
          "description": "Defines durable invariants, failure recovery, observable verification, and safe rollout."
        }
      ]
    }
  ],
  "alternatives": [
    "Use an append-only event log with transactional projections.",
    "Use a database snapshot plus a versioned resume cursor."
  ],
  "commonMistakes": [
    "Trusting delivery order or treating retries as new operations.",
    "Mutating caller-owned arrays or accepting cross-channel data.",
    "Presenting a fixture result as a guarantee of real-time delivery or media connectivity."
  ],
  "followUps": [
    {
      "id": "notification-delivery-production",
      "question": "How would an outbox and provider idempotency key handle a crash after sending but before recording success?",
      "expectedConcepts": [
        "durable ordering",
        "authenticated scope",
        "replay",
        "failure recovery"
      ],
      "sampleStrongAnswer": "Record the event decision before evaluating preferences so replay cannot turn a suppressed event into a new notification. Keep first-event ordering and apply self/mute rules before mentions. Production needs a durable recipient-event idempotency key and transactional outbox, plus a separate acknowledgement/retry policy for the external delivery provider. Persist the authoritative decision atomically, enforce scope on the server, and verify replay and failure behavior with integration tests."
    }
  ]
}
```
