# Reference: Move updateTag out of a Route Handler

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "updateTag is limited to Server Actions. A Route Handler that needs immediate tag expiry uses the documented revalidateTag profile instead, or selects max when stale service is acceptable. The invalidation endpoint still needs authentication and a server-owned tag policy.",
    "codeOrArtifact": "// Corrected review reference: app/api/revalidate/route.ts\nimport { revalidateTag } from 'next/cache';\nimport { authorizeRevalidation } from '@/lib/revalidation-auth';\nexport async function POST(request:Request){await authorizeRevalidation(request);revalidateTag('products',{expire:0});return Response.json({ok:true});}",
    "architectureNotes": "Verification:\n- Call the defective handler in a real 16 server and observe the unsupported context.\n- Use an authorized request against the corrected handler.\n- Confirm the next tagged read fetches fresh data; test rejected callers and replay policy.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-update-tag-context-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "updateTag is limited to Server Actions. A Route Handler that needs immediate tag expiry uses the documented revalidateTag profile instead, or selects max when stale service is acceptable. The invalidation endpoint still needs authentication and a server-owned tag policy.",
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
      "id": "next-lab-update-tag-context-testing",
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
      "id": "next-lab-update-tag-context-security",
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
      "id": "next-lab-update-tag-context-tradeoffs",
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
    "A public side-effecting GET endpoint can be triggered unintentionally and grants uncontrolled cache fan-out. Use authenticated bounded POST processing and map accepted events to known tags."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-update-tag-context-extension",
      "question": "Why not expose a GET URL with an arbitrary tag parameter?",
      "expectedConcepts": [
        "Cache Components (16)",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "A public side-effecting GET endpoint can be triggered unintentionally and grants uncontrolled cache fan-out. Use authenticated bounded POST processing and map accepted events to known tags."
    }
  ]
}
```
