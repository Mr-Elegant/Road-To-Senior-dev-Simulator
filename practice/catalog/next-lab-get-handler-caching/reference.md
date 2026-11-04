# Reference: Keep a personalized GET handler out of shared caches

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Next.js 15 changes GET Route Handler default caching, but a sensitive endpoint should also have deliberate HTTP cache semantics and an authenticated data projection. A static opt-in is inappropriate for current-user data. A session helper is an integration boundary that must verify the actual cookie/token and ownership.",
    "codeOrArtifact": "// Corrected review reference: app/api/profile/route.ts\nimport { getVerifiedSession } from '@/lib/auth';\nexport async function GET(){const session=await getVerifiedSession();if(!session)return Response.json({error:'Unauthorized'},{status:401,headers:{'Cache-Control':'private, no-store'}});return Response.json({name:session.user.name},{headers:{'Cache-Control':'private, no-store'}});}",
    "architectureNotes": "Verification:\n- Request as two different users and anonymously.\n- Inspect response headers through the real CDN/proxy.\n- Verify the response includes no session token or internal account fields.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-get-handler-caching-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Next.js 15 changes GET Route Handler default caching, but a sensitive endpoint should also have deliberate HTTP cache semantics and an authenticated data projection. A static opt-in is inappropriate for current-user data. A session helper is an integration boundary that must verify the actual cookie/token and ownership.",
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
      "id": "next-lab-get-handler-caching-testing",
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
      "id": "next-lab-get-handler-caching-security",
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
      "id": "next-lab-get-handler-caching-tradeoffs",
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
    "Yes, when its representation and invalidation policy are genuinely public. Opt in intentionally under the chosen rendering model and verify deployment-layer behavior; GET alone is not a privacy classification."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-get-handler-caching-extension",
      "question": "Can a public GET handler be cached?",
      "expectedConcepts": [
        "Route handlers and APIs",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Yes, when its representation and invalidation policy are genuinely public. Opt in intentionally under the chosen rendering model and verify deployment-layer behavior; GET alone is not a privacy classification."
    }
  ]
}
```
