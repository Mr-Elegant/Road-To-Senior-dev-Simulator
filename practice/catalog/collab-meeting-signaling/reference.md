# Reference: Collaboration: Reject Stale Meeting Signaling After Reconnect

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "codeOrArtifact": "function solution({epoch,phase,offerId,events}) {\n  const seen = new Set();\n  const outcomes = events.map(e=>{\n    if(seen.has(e.id)) return 'duplicate'; seen.add(e.id);\n    if(e.epoch<epoch) return 'stale';\n    if(e.epoch>epoch) {\n      if(e.type!=='offer') return 'unexpected';\n      epoch=e.epoch; phase='offered'; offerId=e.offerId; return 'offered';\n    }\n    if(e.type==='offer') {\n      if(phase==='closed') return 'unexpected';\n      if(phase==='idle') { phase='offered'; offerId=e.offerId; return 'offered'; }\n      return offerId===e.offerId ? 'duplicate' : 'conflict';\n    }\n    if(e.type==='answer') {\n      if(e.offerId!==offerId) return 'unexpected';\n      if(phase==='connected') return 'duplicate';\n      if(phase!=='offered') return 'unexpected';\n      phase='connected'; return 'connected';\n    }\n    if(phase==='closed') return 'duplicate';\n    if(phase==='idle') return 'unexpected';\n    phase='closed'; return 'closed';\n  });\n  return {epoch,phase,offerId,outcomes};\n}",
    "explanation": "Fence each call generation with an epoch and correlate answers with the active offer. A stale disconnect must never mutate a newer generation, and a closed epoch cannot reopen. This model deliberately omits SDP/ICE and glare resolution: real WebRTC needs authenticated room signaling, perfect-negotiation rules, TURN connectivity, and browser interoperability tests.",
    "architectureNotes": "How would you add perfect negotiation, ICE restart, TURN fallback, and participant authorization to a real meeting service? Production implementations additionally need durable state, authenticated scope, observability, and a tested recovery/rollback plan. In-memory fixtures do not establish distributed-system guarantees."
  },
  "rubric": [
    {
      "id": "collab-meeting-signaling-correctness",
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
      "id": "collab-meeting-signaling-production",
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
      "id": "meeting-signaling-production",
      "question": "How would you add perfect negotiation, ICE restart, TURN fallback, and participant authorization to a real meeting service?",
      "expectedConcepts": [
        "durable ordering",
        "authenticated scope",
        "replay",
        "failure recovery"
      ],
      "sampleStrongAnswer": "Fence each call generation with an epoch and correlate answers with the active offer. A stale disconnect must never mutate a newer generation, and a closed epoch cannot reopen. This model deliberately omits SDP/ICE and glare resolution: real WebRTC needs authenticated room signaling, perfect-negotiation rules, TURN connectivity, and browser interoperability tests. Persist the authoritative decision atomically, enforce scope on the server, and verify replay and failure behavior with integration tests."
    }
  ]
}
```
