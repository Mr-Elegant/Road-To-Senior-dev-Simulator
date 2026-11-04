# Reference: Rename Middleware to Proxy without changing routing intent

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Filename, export and runtime rules migrate together. Preserve a statically analyzable matcher and compare ordinary navigation, direct loads and mutation requests. The sample header is routing instrumentation, not an authentication decision; the data layer must still verify identity.",
    "codeOrArtifact": "// Corrected review reference: proxy.ts\nimport { NextResponse,type NextRequest } from 'next/server';\nexport function proxy(request:NextRequest){const response=NextResponse.next();response.headers.set('x-route-policy','v2');return response;}\nexport const config={matcher:['/account/:path*']};",
    "architectureNotes": "Verification:\n- Compare the 15 middleware and 16 proxy path coverage.\n- Build without an unsupported Proxy runtime export.\n- Verify unrelated assets are not intercepted and protected actions still authorize internally.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-proxy-migration-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Filename, export and runtime rules migrate together. Preserve a statically analyzable matcher and compare ordinary navigation, direct loads and mutation requests. The sample header is routing instrumentation, not an authentication decision; the data layer must still verify identity.",
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
      "id": "next-lab-proxy-migration-testing",
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
      "id": "next-lab-proxy-migration-security",
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
      "id": "next-lab-proxy-migration-tradeoffs",
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
    "Prefer bounded lightweight routing checks and enforce real authorization near data access. Database work in the routing layer can become a latency and availability dependency for every matched request."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-proxy-migration-extension",
      "question": "Should Proxy make slow database calls on every navigation?",
      "expectedConcepts": [
        "Versions and migrations",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Prefer bounded lightweight routing checks and enforce real authorization near data access. Database work in the routing layer can become a latency and availability dependency for every matched request."
    }
  ]
}
```
