# Reference: Design URL-driven search with safe caching and indexing lag

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep draft input separate from committed URL query state, debounce navigation deliberately and preserve unrelated filters. Normalize and bound query length, filters and pagination before server reads. Authorize tenant/resource scope in the search query and result projection; cache only eligible bounded representations with complete keys. Use a dedicated index for search while treating its lag as an explicit product property, and revalidate sensitive object access against the authoritative system before actions.",
    "architectureNotes": "A deleted or newly restricted document may remain in the index. Enforce result visibility at a trusted boundary and define removal/permission propagation bounds, rather than assuming eventual indexing lag is acceptable for private data.",
    "codeOrArtifact": "# Decision record: Design URL-driven search with safe caching and indexing lag\n\n## Context and scale\nEach keystroke requests a full server page, mixes tenant results in one cache key and loses filters on navigation.\n10 million documents; p95 search under 600 ms; index lag up to 30 seconds\n\n## Accepted constraints\n- Preserve shareable admitted query state.\n- Bound request/caching cardinality.\n- Communicate stale index semantics and authorization.\n\n## Design and ownership\nKeep draft input separate from committed URL query state, debounce navigation deliberately and preserve unrelated filters. Normalize and bound query length, filters and pagination before server reads. Authorize tenant/resource scope in the search query and result projection; cache only eligible bounded representations with complete keys. Use a dedicated index for search while treating its lag as an explicit product property, and revalidate sensitive object access against the authoritative system before actions.\n\n## Failure and recovery\nA deleted or newly restricted document may remain in the index. Enforce result visibility at a trusted boundary and define removal/permission propagation bounds, rather than assuming eventual indexing lag is acceptable for private data.\n\n## Verification gates\n- Race old/new queries and confirm late results cannot overwrite the current query.\n- Warm one tenant’s query then repeat it from another.\n- Delete or revoke indexed content and measure the visibility boundary.\n\n## Interview change\nWould rendering every result as a Client Component improve it?\nIt changes bundle and hydration cost, not search correctness. Use server-owned search data and small client interactions, then measure rendering cost and pagination/virtualization needs independently.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-search-architecture-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Keep draft input separate from committed URL query state, debounce navigation deliberately and preserve unrelated filters. Normalize and bound query length, filters and pagination before server reads. Authorize tenant/resource scope in the search query and result projection; cache only eligible bounded representations with complete keys. Use a dedicated index for search while treating its lag as an explicit product property, and revalidate sensitive object access against the authoritative system before actions.",
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
      "id": "next-lab-search-architecture-testing",
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
      "id": "next-lab-search-architecture-security",
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
      "id": "next-lab-search-architecture-tradeoffs",
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
    "It changes bundle and hydration cost, not search correctness. Use server-owned search data and small client interactions, then measure rendering cost and pagination/virtualization needs independently."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-search-architecture-extension",
      "question": "Would rendering every result as a Client Component improve it?",
      "expectedConcepts": [
        "Domain architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "It changes bundle and hydration cost, not search correctness. Use server-owned search data and small client interactions, then measure rendering cost and pagination/virtualization needs independently."
    }
  ]
}
```
