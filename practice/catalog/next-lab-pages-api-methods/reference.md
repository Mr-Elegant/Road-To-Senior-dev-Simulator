# Reference: Preserve HTTP semantics in a Pages API route

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A Pages API default handler uses NextApiRequest/NextApiResponse, unlike App Router named Web Request/Response method exports. Reject unsupported methods deliberately and publish an Allow header. A public liveness response must not reveal credentials, database contents or a privileged readiness decision.",
    "codeOrArtifact": "// Corrected review reference: pages/api/health.ts\nimport type { NextApiRequest,NextApiResponse } from 'next';\nexport default function handler(req:NextApiRequest,res:NextApiResponse){if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'});}res.setHeader('Cache-Control','no-store');return res.status(200).json({ok:true});}",
    "architectureNotes": "Verification:\n- Send GET and POST to the actual endpoint.\n- Assert status, Allow and Cache-Control headers.\n- Verify the handler follows the intended liveness/readiness contract during a dependency outage.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-pages-api-methods-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A Pages API default handler uses NextApiRequest/NextApiResponse, unlike App Router named Web Request/Response method exports. Reject unsupported methods deliberately and publish an Allow header. A public liveness response must not reveal credentials, database contents or a privileged readiness decision.",
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
      "id": "next-lab-pages-api-methods-testing",
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
      "id": "next-lab-pages-api-methods-security",
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
      "id": "next-lab-pages-api-methods-tradeoffs",
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
    "Named GET/POST exports are App Router Route Handler conventions. Migrate the file location and HTTP adapter together while preserving external status/body semantics and authentication."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-pages-api-methods-extension",
      "question": "Can you export GET beside the default Pages handler?",
      "expectedConcepts": [
        "Pages Router and migration",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Named GET/POST exports are App Router Route Handler conventions. Migrate the file location and HTTP adapter together while preserving external status/body semantics and authentication."
    }
  ]
}
```
