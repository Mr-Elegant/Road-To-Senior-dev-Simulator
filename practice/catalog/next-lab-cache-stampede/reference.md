# Reference: Protect the origin during cold-cache and invalidation storms

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Choose cache scopes and invalidation granularity based on actual read graphs. Use supported request coalescing/lease behavior in the shared cache or data layer, bounded concurrency and timeouts. Where the product permits it, serve a bounded stale representation while a controlled refresh runs. Warm only a measured valuable set after deployment and jitter refresh scheduling where appropriate. Preserve actor/tenant partitions and do not claim a process-local promise deduplicates work across all instances.",
    "architectureNotes": "A lease owner can crash. Bound lease expiry, prevent obsolete refresh results from overwriting newer versions, and expose refresh queue depth, error rates and served age to operators.",
    "codeOrArtifact": "# Decision record: Protect the origin during cold-cache and invalidation storms\n\n## Context and scale\nEvery instance recomputes an expensive dashboard simultaneously after a broad invalidation.\n10,000 requests/second; a shared homepage cache expires during a deploy\n\n## Accepted constraints\n- Bound concurrent origin work.\n- Keep freshness and fairness explicit.\n- Avoid cache locks becoming a permanent failure mode.\n\n## Design and ownership\nChoose cache scopes and invalidation granularity based on actual read graphs. Use supported request coalescing/lease behavior in the shared cache or data layer, bounded concurrency and timeouts. Where the product permits it, serve a bounded stale representation while a controlled refresh runs. Warm only a measured valuable set after deployment and jitter refresh scheduling where appropriate. Preserve actor/tenant partitions and do not claim a process-local promise deduplicates work across all instances.\n\n## Failure and recovery\nA lease owner can crash. Bound lease expiry, prevent obsolete refresh results from overwriting newer versions, and expose refresh queue depth, error rates and served age to operators.\n\n## Verification gates\n- Send a synchronized cold burst across multiple instances.\n- Kill the refresh owner and verify eventual progress.\n- Trigger narrow and broad invalidations while measuring database connections and p99 latency.\n\n## Interview change\nCan a very long TTL solve the incident?\nIt can hide load by accepting more staleness, but may violate freshness or revocation. Define the product’s stale-service budget and durable source behavior before treating TTL as a capacity strategy.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-cache-stampede-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Choose cache scopes and invalidation granularity based on actual read graphs. Use supported request coalescing/lease behavior in the shared cache or data layer, bounded concurrency and timeouts. Where the product permits it, serve a bounded stale representation while a controlled refresh runs. Warm only a measured valuable set after deployment and jitter refresh scheduling where appropriate. Preserve actor/tenant partitions and do not claim a process-local promise deduplicates work across all instances.",
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
      "id": "next-lab-cache-stampede-testing",
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
      "id": "next-lab-cache-stampede-security",
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
      "id": "next-lab-cache-stampede-tradeoffs",
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
    "It can hide load by accepting more staleness, but may violate freshness or revocation. Define the product’s stale-service budget and durable source behavior before treating TTL as a capacity strategy."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-cache-stampede-extension",
      "question": "Can a very long TTL solve the incident?",
      "expectedConcepts": [
        "Reliability architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "It can hide load by accepting more staleness, but may violate freshness or revocation. Define the product’s stale-service budget and durable source behavior before treating TTL as a capacity strategy."
    }
  ]
}
```
