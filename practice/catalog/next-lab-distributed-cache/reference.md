# Reference: Design cross-instance cache consistency and invalidation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep the database as authority and choose a supported shared cache handler/storage strategy for the selected Next.js rendering model. Partition keys by representation/version and use bounded lifetimes. Publish invalidations through a durable outbox after commit, consume them idempotently, and include entity versions so older updates cannot supersede newer values. Distinguish Next server data/route caches, client Router Cache, CDN caches and browser caches in the read graph.",
    "architectureNotes": "One region can miss an invalidation during a network partition. Bound staleness with expiry and version checks, expose served version/age in telemetry, and define when a representation must fail closed rather than serve stale.",
    "codeOrArtifact": "# Decision record: Design cross-instance cache consistency and invalidation\n\n## Context and scale\nAn in-memory cache appears correct on a single developer server but serves different versions after scale-out.\n30 stateless instances across two regions; 100,000 cached product representations\n\n## Accepted constraints\n- Name authoritative state and cache ownership.\n- Define public stale-serving and private-data exclusion.\n- Handle invalidation duplication, delay and out-of-order delivery.\n\n## Design and ownership\nKeep the database as authority and choose a supported shared cache handler/storage strategy for the selected Next.js rendering model. Partition keys by representation/version and use bounded lifetimes. Publish invalidations through a durable outbox after commit, consume them idempotently, and include entity versions so older updates cannot supersede newer values. Distinguish Next server data/route caches, client Router Cache, CDN caches and browser caches in the read graph.\n\n## Failure and recovery\nOne region can miss an invalidation during a network partition. Bound staleness with expiry and version checks, expose served version/age in telemetry, and define when a representation must fail closed rather than serve stale.\n\n## Verification gates\n- Write through one instance and read through all others.\n- Delay, duplicate and reorder invalidation events.\n- Restart instances and measure cold-start/origin amplification against the stated freshness SLO.\n\n## Interview change\nWould updateTag make a distributed transaction?\nNo. It expresses a framework cache invalidation operation in an allowed context. Durable business commit, event delivery, cache-handler support and multi-region convergence remain explicit architectural responsibilities.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-distributed-cache-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Keep the database as authority and choose a supported shared cache handler/storage strategy for the selected Next.js rendering model. Partition keys by representation/version and use bounded lifetimes. Publish invalidations through a durable outbox after commit, consume them idempotently, and include entity versions so older updates cannot supersede newer values. Distinguish Next server data/route caches, client Router Cache, CDN caches and browser caches in the read graph.",
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
      "id": "next-lab-distributed-cache-testing",
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
      "id": "next-lab-distributed-cache-security",
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
      "id": "next-lab-distributed-cache-tradeoffs",
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
    "No. It expresses a framework cache invalidation operation in an allowed context. Durable business commit, event delivery, cache-handler support and multi-region convergence remain explicit architectural responsibilities."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-distributed-cache-extension",
      "question": "Would updateTag make a distributed transaction?",
      "expectedConcepts": [
        "Platform architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "No. It expresses a framework cache invalidation operation in an allowed context. Durable business commit, event delivery, cache-handler support and multi-region convergence remain explicit architectural responsibilities."
    }
  ]
}
```
