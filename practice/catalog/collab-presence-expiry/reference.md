# Reference: Collaboration: Expire Presence Without Disconnecting Other Tabs

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "codeOrArtifact": "function solution({now,sessions}) {\n  const latest = new Map();\n  for(const s of sessions) if(!latest.has(s.id) || s.version>latest.get(s.id).version) latest.set(s.id,s);\n  const active = [...latest.values()].filter(s=>s.online && s.expiresAt>now);\n  return {onlineUsers:[...new Set(active.map(s=>s.userId))].sort(),activeSessions:active.length};\n}",
    "explanation": "Retain session tombstones by version before calculating expiry, then aggregate active sessions into a distinct user set. Expiry uses a strict greater-than boundary. Production needs authoritative server clocks, bounded leases, and retained disconnect revisions; deleting a tombstone too early can let stale heartbeats resurrect presence.",
    "architectureNotes": "How would you implement leases, typing-indicator expiry, and disconnect tombstone retention across presence servers? Production implementations additionally need durable state, authenticated scope, observability, and a tested recovery/rollback plan. In-memory fixtures do not establish distributed-system guarantees."
  },
  "rubric": [
    {
      "id": "collab-presence-expiry-correctness",
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
      "id": "collab-presence-expiry-production",
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
      "id": "presence-expiry-production",
      "question": "How would you implement leases, typing-indicator expiry, and disconnect tombstone retention across presence servers?",
      "expectedConcepts": [
        "durable ordering",
        "authenticated scope",
        "replay",
        "failure recovery"
      ],
      "sampleStrongAnswer": "Retain session tombstones by version before calculating expiry, then aggregate active sessions into a distinct user set. Expiry uses a strict greater-than boundary. Production needs authoritative server clocks, bounded leases, and retained disconnect revisions; deleting a tombstone too early can let stale heartbeats resurrect presence. Persist the authoritative decision atomically, enforce scope on the server, and verify replay and failure behavior with integration tests."
    }
  ]
}
```
