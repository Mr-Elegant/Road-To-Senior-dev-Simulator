# Reference: Keep metadata exports in a Server Component

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Metadata exports belong to the server route module. Extract any interactive part into a separate client leaf rather than marking the metadata owner client-side. Metadata inheritance and streaming are framework behavior, so inspect the real output instead of manually appending competing head tags in an effect.",
    "codeOrArtifact": "// Corrected review reference: app/about/page.tsx\nimport type { Metadata } from 'next';\nexport const metadata:Metadata={title:'About Engineering Lab',description:'Version-aware engineering practice.'};\nexport default function Page(){return <h1>About Engineering Lab</h1>;}",
    "architectureNotes": "Verification:\n- Build without a client metadata-export error.\n- Inspect the rendered title and description on a direct request.\n- Navigate client-side to and from the route and verify the head updates.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-metadata-server-boundary-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Metadata exports belong to the server route module. Extract any interactive part into a separate client leaf rather than marking the metadata owner client-side. Metadata inheritance and streaming are framework behavior, so inspect the real output instead of manually appending competing head tags in an effect.",
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
      "id": "next-lab-metadata-server-boundary-testing",
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
      "id": "next-lab-metadata-server-boundary-security",
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
      "id": "next-lab-metadata-server-boundary-tradeoffs",
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
    "Share the appropriate server data function and understand request memoization versus persistent caching. Both consumers must use the same admitted key and error policy; do not create a second public HTTP hop to your own Route Handler."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-metadata-server-boundary-extension",
      "question": "How do you avoid duplicate product fetches in generateMetadata and Page?",
      "expectedConcepts": [
        "Metadata and assets",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Share the appropriate server data function and understand request memoization versus persistent caching. Both consumers must use the same admitted key and error policy; do not create a second public HTTP hop to your own Route Handler."
    }
  ]
}
```
