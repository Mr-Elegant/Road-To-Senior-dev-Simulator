# Reference: Collaboration: Keep Read Receipts Monotonic Across Devices

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "codeOrArtifact": "function solution({userId,lastRead,highWater,updates}) {\n  const outcomes = updates.map(u => {\n    if (u.userId !== userId) return 'forbidden';\n    if (!Number.isSafeInteger(u.sequence) || u.sequence<0 || u.sequence>highWater) return 'invalid';\n    if (u.sequence<=lastRead) return 'stale';\n    lastRead=u.sequence; return 'advanced';\n  });\n  return {lastRead,unread:highWater-lastRead,outcomes};\n}",
    "explanation": "Model the receipt as a monotonic maximum bounded by the conversation high-water mark. Authenticate the receipt owner, reject impossible sequence values, and derive unread rather than incrementally adjusting a counter on retries. A production unread count may need visibility filters and deletion semantics beyond this contiguous-log model.",
    "architectureNotes": "How would you atomically merge read positions across devices while excluding messages the recipient cannot see? Production implementations additionally need durable state, authenticated scope, observability, and a tested recovery/rollback plan. In-memory fixtures do not establish distributed-system guarantees."
  },
  "rubric": [
    {
      "id": "collab-read-receipts-correctness",
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
      "id": "collab-read-receipts-production",
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
      "id": "read-receipts-production",
      "question": "How would you atomically merge read positions across devices while excluding messages the recipient cannot see?",
      "expectedConcepts": [
        "durable ordering",
        "authenticated scope",
        "replay",
        "failure recovery"
      ],
      "sampleStrongAnswer": "Model the receipt as a monotonic maximum bounded by the conversation high-water mark. Authenticate the receipt owner, reject impossible sequence values, and derive unread rather than incrementally adjusting a counter on retries. A production unread count may need visibility filters and deletion semantics beyond this contiguous-log model. Persist the authoritative decision atomically, enforce scope on the server, and verify replay and failure behavior with integration tests."
    }
  ]
}
```
