# Reference: Plan regional rendering around data residency and latency

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Map trusted tenant identity to an allowed home region and locate authorized reads/mutations near its source of truth. Cache only representations allowed in each region and separate public asset delivery from private data. Bound cross-region dependencies and include region/tenant in telemetry. Choose single-writer or explicit conflict resolution instead of assuming globally distributed rendering provides globally consistent writes. Treat deployment-provider region controls as implementation-specific inputs to the design.",
    "architectureNotes": "The home region may fail while the nearest region remains healthy. Decide which operations can serve stale public data, which can fail over to an admitted replica and which must be unavailable to preserve correctness or residency.",
    "codeOrArtifact": "# Decision record: Plan regional rendering around data residency and latency\n\n## Context and scale\nThe application pushes every request to the nearest compute region while its database and cache remain in one distant region.\nEU and India tenants; p95 private-page latency under 900 ms; residency constraints\n\n## Accepted constraints\n- Keep protected data in admitted regions.\n- Avoid region-to-database waterfalls.\n- Define regional failover and legal constraints explicitly.\n\n## Design and ownership\nMap trusted tenant identity to an allowed home region and locate authorized reads/mutations near its source of truth. Cache only representations allowed in each region and separate public asset delivery from private data. Bound cross-region dependencies and include region/tenant in telemetry. Choose single-writer or explicit conflict resolution instead of assuming globally distributed rendering provides globally consistent writes. Treat deployment-provider region controls as implementation-specific inputs to the design.\n\n## Failure and recovery\nThe home region may fail while the nearest region remains healthy. Decide which operations can serve stale public data, which can fail over to an admitted replica and which must be unavailable to preserve correctness or residency.\n\n## Verification gates\n- Inject region latency and loss, measuring end-to-end rather than compute-only time.\n- Inspect cache/object locations and routing decisions for representative tenants.\n- Rehearse a failover and reconciliation of in-flight mutations.\n\n## Interview change\nIs an Edge runtime always faster?\nNo. Runtime compatibility, cold starts, data distance and connection constraints matter. A small function near a user can be slower if it repeatedly crosses an ocean to the database.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-regional-data-residency-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Map trusted tenant identity to an allowed home region and locate authorized reads/mutations near its source of truth. Cache only representations allowed in each region and separate public asset delivery from private data. Bound cross-region dependencies and include region/tenant in telemetry. Choose single-writer or explicit conflict resolution instead of assuming globally distributed rendering provides globally consistent writes. Treat deployment-provider region controls as implementation-specific inputs to the design.",
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
      "id": "next-lab-regional-data-residency-testing",
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
      "id": "next-lab-regional-data-residency-security",
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
      "id": "next-lab-regional-data-residency-tradeoffs",
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
    "No. Runtime compatibility, cold starts, data distance and connection constraints matter. A small function near a user can be slower if it repeatedly crosses an ocean to the database."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-regional-data-residency-extension",
      "question": "Is an Edge runtime always faster?",
      "expectedConcepts": [
        "Delivery architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "No. Runtime compatibility, cold starts, data distance and connection constraints matter. A small function near a user can be slower if it repeatedly crosses an ocean to the database."
    }
  ]
}
```
