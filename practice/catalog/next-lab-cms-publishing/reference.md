# Reference: Design CMS publishing with draft isolation and bounded freshness

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Resolve CMS events through signature verification, durable event admission and a server-owned content/tag map. Keep draft-mode access authenticated and separate from public cache entries. Publish an authoritative content version, then invalidate the affected entity/list/path representations according to the freshness contract. Use current revalidation APIs in allowed contexts, and expose publication version/age in operational telemetry. Preview correctness must not require sharing an editor’s cookie with the public CDN.",
    "architectureNotes": "Out-of-order publish/unpublish events can revive withdrawn content. Compare version/sequence semantics at the authoritative boundary and make unpublish/revocation propagation a distinct correctness requirement.",
    "codeOrArtifact": "# Decision record: Design CMS publishing with draft isolation and bounded freshness\n\n## Context and scale\nThe CMS webhook invalidates every page and draft content sometimes appears in the public cache.\n10,000 content routes; editors need immediate previews; public freshness under 60 seconds\n\n## Accepted constraints\n- Separate draft and published representations.\n- Authenticate and deduplicate publishing events.\n- Bound invalidation fan-out and observe convergence.\n\n## Design and ownership\nResolve CMS events through signature verification, durable event admission and a server-owned content/tag map. Keep draft-mode access authenticated and separate from public cache entries. Publish an authoritative content version, then invalidate the affected entity/list/path representations according to the freshness contract. Use current revalidation APIs in allowed contexts, and expose publication version/age in operational telemetry. Preview correctness must not require sharing an editor’s cookie with the public CDN.\n\n## Failure and recovery\nOut-of-order publish/unpublish events can revive withdrawn content. Compare version/sequence semantics at the authoritative boundary and make unpublish/revocation propagation a distinct correctness requirement.\n\n## Verification gates\n- Replay, duplicate and reorder CMS events.\n- Warm public caches before opening an authenticated draft preview.\n- Unpublish content and measure removal from all supported regions and navigation paths.\n\n## Interview change\nWhy not call updateTag directly in the webhook?\nIn Next.js 16 updateTag is Server-Action-only. A Route Handler uses the documented revalidateTag profile; API context and chosen consistency semantics are both part of the design.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-cms-publishing-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Resolve CMS events through signature verification, durable event admission and a server-owned content/tag map. Keep draft-mode access authenticated and separate from public cache entries. Publish an authoritative content version, then invalidate the affected entity/list/path representations according to the freshness contract. Use current revalidation APIs in allowed contexts, and expose publication version/age in operational telemetry. Preview correctness must not require sharing an editor’s cookie with the public CDN.",
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
      "id": "next-lab-cms-publishing-testing",
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
      "id": "next-lab-cms-publishing-security",
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
      "id": "next-lab-cms-publishing-tradeoffs",
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
    "In Next.js 16 updateTag is Server-Action-only. A Route Handler uses the documented revalidateTag profile; API context and chosen consistency semantics are both part of the design."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-cms-publishing-extension",
      "question": "Why not call updateTag directly in the webhook?",
      "expectedConcepts": [
        "Domain architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "In Next.js 16 updateTag is Server-Action-only. A Route Handler uses the documented revalidateTag profile; API context and chosen consistency semantics are both part of the design."
    }
  ]
}
```
