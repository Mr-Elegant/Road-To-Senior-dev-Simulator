# Reference: Combine a server-rendered dashboard with live client updates

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Fetch an authorized versioned initial snapshot on the server and hydrate a small client island for live state. Use an authenticated supported real-time service/transport, resource-scoped sequence/version checks and idempotent event application. Keep subscriptions and reconnect timers owned by the active actor/resource, with cleanup on unmount or account switch. On a gap, fetch a bounded reconciliation snapshot instead of assuming every missed event is still available. Avoid presenting serverless request instances as durable socket infrastructure without platform support.",
    "architectureNotes": "A stale connection can deliver events after the user switches tenants. Reject messages by active subscription ownership and server-authorized channel scope; client-side filtering alone cannot secure the upstream stream.",
    "codeOrArtifact": "# Decision record: Combine a server-rendered dashboard with live client updates\n\n## Context and scale\nA dashboard remounts the full application every few seconds to fetch a new session and replace all data.\n5,000 connected users; events can be duplicated and delivered out of order\n\n## Accepted constraints\n- Deliver an authorized initial snapshot.\n- Reconcile live events without cross-account leakage.\n- Handle disconnect and catch-up explicitly.\n\n## Design and ownership\nFetch an authorized versioned initial snapshot on the server and hydrate a small client island for live state. Use an authenticated supported real-time service/transport, resource-scoped sequence/version checks and idempotent event application. Keep subscriptions and reconnect timers owned by the active actor/resource, with cleanup on unmount or account switch. On a gap, fetch a bounded reconciliation snapshot instead of assuming every missed event is still available. Avoid presenting serverless request instances as durable socket infrastructure without platform support.\n\n## Failure and recovery\nA stale connection can deliver events after the user switches tenants. Reject messages by active subscription ownership and server-authorized channel scope; client-side filtering alone cannot secure the upstream stream.\n\n## Verification gates\n- Duplicate/reorder events and introduce sequence gaps.\n- Disconnect, reconnect and change accounts during catch-up.\n- Measure visible freshness, subscription cleanup and bounded memory growth.\n\n## Interview change\nShould every event call router.refresh?\nUse it deliberately for server-owned reconciliation rather than as an unbounded per-event rebuild. Coalesce refreshes, preserve client state and measure server load; some events can update an admitted client projection directly.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-realtime-dashboard-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Fetch an authorized versioned initial snapshot on the server and hydrate a small client island for live state. Use an authenticated supported real-time service/transport, resource-scoped sequence/version checks and idempotent event application. Keep subscriptions and reconnect timers owned by the active actor/resource, with cleanup on unmount or account switch. On a gap, fetch a bounded reconciliation snapshot instead of assuming every missed event is still available. Avoid presenting serverless request instances as durable socket infrastructure without platform support.",
      "weight": 5,
      "levels": [
        {
          "score": 0,
          "description": "Missing or contradicted by the implementation."
        },
        {
          "score": 1,
          "description": "Happy path only; important counterexamples remain."
        },
        {
          "score": 2,
          "description": "Meets the stated contract with evidence and correct version assumptions."
        },
        {
          "score": 3,
          "description": "Meets the contract and explains failure recovery, limits and the changed requirement."
        }
      ]
    },
    {
      "id": "next-lab-realtime-dashboard-testing",
      "category": "testing",
      "label": "Evidence and counterexamples",
      "description": "Show the authored boundary cases and distinguish policy-model evidence from real Next.js runtime evidence.",
      "weight": 4,
      "levels": [
        {
          "score": 0,
          "description": "Missing or contradicted by the implementation."
        },
        {
          "score": 1,
          "description": "Happy path only; important counterexamples remain."
        },
        {
          "score": 2,
          "description": "Meets the stated contract with evidence and correct version assumptions."
        },
        {
          "score": 3,
          "description": "Meets the contract and explains failure recovery, limits and the changed requirement."
        }
      ]
    },
    {
      "id": "next-lab-realtime-dashboard-security",
      "category": "security",
      "label": "Isolation and trust boundaries",
      "description": "Explain caller validation, data exposure, authorization and the limits relevant to this task.",
      "weight": 3,
      "levels": [
        {
          "score": 0,
          "description": "Missing or contradicted by the implementation."
        },
        {
          "score": 1,
          "description": "Happy path only; important counterexamples remain."
        },
        {
          "score": 2,
          "description": "Meets the stated contract with evidence and correct version assumptions."
        },
        {
          "score": 3,
          "description": "Meets the contract and explains failure recovery, limits and the changed requirement."
        }
      ]
    },
    {
      "id": "next-lab-realtime-dashboard-tradeoffs",
      "category": "tradeoffs",
      "label": "Versions and operational trade-offs",
      "description": "Explain the 15/16 behavior, configuration assumptions, rollout and the interview variation.",
      "weight": 3,
      "levels": [
        {
          "score": 0,
          "description": "Missing or contradicted by the implementation."
        },
        {
          "score": 1,
          "description": "Happy path only; important counterexamples remain."
        },
        {
          "score": 2,
          "description": "Meets the stated contract with evidence and correct version assumptions."
        },
        {
          "score": 3,
          "description": "Meets the contract and explains failure recovery, limits and the changed requirement."
        }
      ]
    }
  ],
  "alternatives": [
    "Use it deliberately for server-owned reconciliation rather than as an unbounded per-event rebuild. Coalesce refreshes, preserve client state and measure server load; some events can update an admitted client projection directly."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-realtime-dashboard-extension",
      "question": "Should every event call router.refresh?",
      "expectedConcepts": [
        "Domain architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "Use it deliberately for server-owned reconciliation rather than as an unbounded per-event rebuild. Coalesce refreshes, preserve client state and measure server load; some events can update an admitted client projection directly."
    }
  ]
}
```
