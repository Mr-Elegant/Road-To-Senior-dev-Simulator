# Reference: Distinguish router.refresh from server data invalidation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "router.refresh requests fresh server-rendered UI and merges the payload while preserving eligible client state. It is not an API for globally purging the Data Cache. If the server data is still cached, a refreshed route can legitimately show the same version.",
    "codeOrArtifact": "// Corrected review reference: app/refresh-button.tsx\n'use client';\nimport { useRouter } from 'next/navigation';\nexport default function Refresh(){const router=useRouter();return <button onClick={()=>router.refresh()}>Request updated server UI</button>;}\n// The mutation boundary must separately revalidate affected server data when required.",
    "architectureNotes": "Verification:\n- Refresh a page with an interactive client counter and inspect state preservation.\n- Repeat while its public data remains cached.\n- Invalidate the assigned data tag at the mutation boundary and compare the next refresh.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-router-refresh-vs-data-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "router.refresh requests fresh server-rendered UI and merges the payload while preserving eligible client state. It is not an API for globally purging the Data Cache. If the server data is still cached, a refreshed route can legitimately show the same version.",
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
      "id": "next-lab-router-refresh-vs-data-testing",
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
      "id": "next-lab-router-refresh-vs-data-security",
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
      "id": "next-lab-router-refresh-vs-data-tradeoffs",
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
    "It targets a path/layout’s cached route behavior in an allowed server context. Shared data used by other routes may need tag-based invalidation too; write down the read graph before choosing the smallest correct invalidation scope."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-router-refresh-vs-data-extension",
      "question": "How does revalidatePath differ?",
      "expectedConcepts": [
        "Caching and revalidation",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "It targets a path/layout’s cached route behavior in an allowed server context. Shared data used by other routes may need tag-based invalidation too; write down the read graph before choosing the smallest correct invalidation scope."
    }
  ]
}
```
