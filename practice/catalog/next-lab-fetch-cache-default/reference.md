# Reference: Make Next.js 15 fetch freshness explicit

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The absence of an explicit cache option is not evidence of persistent data caching in Next.js 15. A static route may still produce reused output, and request deduplication may still remove duplicate reads; those observations do not establish the Data Cache lifetime. Tagging only helps data that is actually cached.",
    "codeOrArtifact": "// Corrected review reference: lib/public-catalog.ts\nexport async function getCatalog(){const response=await fetch('https://catalog.example.com/public',{cache:'force-cache',next:{tags:['public-catalog']}});if(!response.ok)throw new Error('Catalog unavailable');return response.json();}",
    "architectureNotes": "Verification:\n- Use an origin request counter across production requests.\n- Compare uncached and explicitly cached variants.\n- Invalidate the assigned tag from an authenticated allowed context and observe a later read.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-fetch-cache-default-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "The absence of an explicit cache option is not evidence of persistent data caching in Next.js 15. A static route may still produce reused output, and request deduplication may still remove duplicate reads; those observations do not establish the Data Cache lifetime. Tagging only helps data that is actually cached.",
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
      "id": "next-lab-fetch-cache-default-testing",
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
      "id": "next-lab-fetch-cache-default-security",
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
      "id": "next-lab-fetch-cache-default-tradeoffs",
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
    "Do not share a public catalog cache entry with personalized prices. Separate public data from tenant/user entitlements and verify all representation dimensions, authorization and HTTP cache layers."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-fetch-cache-default-extension",
      "question": "What if this endpoint returns user-specific prices?",
      "expectedConcepts": [
        "Caching and revalidation",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Do not share a public catalog cache entry with personalized prices. Separate public data from tenant/user entitlements and verify all representation dimensions, authorization and HTTP cache layers."
    }
  ]
}
```
