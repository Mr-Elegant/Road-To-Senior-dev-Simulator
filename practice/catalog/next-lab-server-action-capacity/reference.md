# Reference: Define Server Action ownership and throughput boundaries

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use Server Actions for supported UI mutation flows with input validation, current authorization and serializable state. Expose a separate documented HTTP/job interface for machine clients needing explicit versioning, batching, concurrency and retry semantics. Keep shared business logic behind authorized operations, persist long-running work before acknowledging it, and use transaction/idempotency boundaries appropriate to the resource. Measure actual framework dispatch and platform limits instead of treating an action call as a general unconstrained RPC transport.",
    "architectureNotes": "A client retries after navigation or a dropped response while the mutation committed. Stable operation identity, durable outcome lookup and receiver-side uniqueness prevent duplicate effects; action transport alone does not supply them.",
    "codeOrArtifact": "# Decision record: Define Server Action ownership and throughput boundaries\n\n## Context and scale\nA team exposes internal action identifiers as its long-term external batch API and assumes unconstrained parallel dispatch.\nHuman form submissions plus a machine client sending hundreds of operations/second\n\n## Accepted constraints\n- Keep UI mutations secure and observable.\n- Provide an intentional external API contract.\n- Bound concurrency and durable work.\n\n## Design and ownership\nUse Server Actions for supported UI mutation flows with input validation, current authorization and serializable state. Expose a separate documented HTTP/job interface for machine clients needing explicit versioning, batching, concurrency and retry semantics. Keep shared business logic behind authorized operations, persist long-running work before acknowledging it, and use transaction/idempotency boundaries appropriate to the resource. Measure actual framework dispatch and platform limits instead of treating an action call as a general unconstrained RPC transport.\n\n## Failure and recovery\nA client retries after navigation or a dropped response while the mutation committed. Stable operation identity, durable outcome lookup and receiver-side uniqueness prevent duplicate effects; action transport alone does not supply them.\n\n## Verification gates\n- Test forged action inputs and current object permissions.\n- Load-test the documented batch API and UI actions separately.\n- Drop responses after commit and verify safe recovery without a second business effect.\n\n## Interview change\nCan both adapters share code?\nYes, share explicit domain operations and DTOs while preserving each adapter’s authentication, request limits and transport semantics. Do not make the Server Component call its own HTTP adapter merely to reuse logic.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-server-action-capacity-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Use Server Actions for supported UI mutation flows with input validation, current authorization and serializable state. Expose a separate documented HTTP/job interface for machine clients needing explicit versioning, batching, concurrency and retry semantics. Keep shared business logic behind authorized operations, persist long-running work before acknowledging it, and use transaction/idempotency boundaries appropriate to the resource. Measure actual framework dispatch and platform limits instead of treating an action call as a general unconstrained RPC transport.",
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
      "id": "next-lab-server-action-capacity-testing",
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
      "id": "next-lab-server-action-capacity-security",
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
      "id": "next-lab-server-action-capacity-tradeoffs",
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
    "Yes, share explicit domain operations and DTOs while preserving each adapter’s authentication, request limits and transport semantics. Do not make the Server Component call its own HTTP adapter merely to reuse logic."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-server-action-capacity-extension",
      "question": "Can both adapters share code?",
      "expectedConcepts": [
        "Domain architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "Yes, share explicit domain operations and DTOs while preserving each adapter’s authentication, request limits and transport semantics. Do not make the Server Component call its own HTTP adapter merely to reuse logic."
    }
  ]
}
```
