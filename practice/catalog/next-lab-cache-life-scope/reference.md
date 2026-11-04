# Reference: Place cacheLife inside the cached function

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "cacheLife belongs inside the function or component whose cache policy it configures, not module initialization. Its stale, revalidate and expire fields express distinct client/server lifetimes. Name those boundaries and the origin failure behavior instead of describing every field as a single universal TTL.",
    "codeOrArtifact": "// Corrected review reference: lib/catalog.ts\nimport { cacheLife } from 'next/cache';\nexport async function getCatalog(){'use cache';cacheLife({stale:60,revalidate:300,expire:3600});return ['one'];}",
    "architectureNotes": "Verification:\n- Build with Cache Components enabled.\n- Verify the function is called in a cache directive scope.\n- Test cold, warm, stale and expired reads with a controllable origin and documented timing tolerances.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-cache-life-scope-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "cacheLife belongs inside the function or component whose cache policy it configures, not module initialization. Its stale, revalidate and expire fields express distinct client/server lifetimes. Name those boundaries and the origin failure behavior instead of describing every field as a single universal TTL.",
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
      "id": "next-lab-cache-life-scope-testing",
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
      "id": "next-lab-cache-life-scope-security",
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
      "id": "next-lab-cache-life-scope-tradeoffs",
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
    "Inspect the framework’s nested lifetime rules and measure the outer representation’s effective policy. Avoid hiding unrelated cacheLife calls in generic utilities; keep the lifetime visible at each cached boundary."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-cache-life-scope-extension",
      "question": "What happens with nested cached functions?",
      "expectedConcepts": [
        "Cache Components (16)",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Inspect the framework’s nested lifetime rules and measure the outer representation’s effective policy. Avoid hiding unrelated cacheLife calls in generic utilities; keep the lifetime visible at each cached boundary."
    }
  ]
}
```
