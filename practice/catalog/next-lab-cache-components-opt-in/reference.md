# Reference: Adopt Cache Components as an explicit rendering change

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Cache Components is a deliberate Next.js 16 opt-in, not a claim that every 16 application uses the same model. Audit replaced experimental PPR configuration, route-segment options and request-dependent work. A flag switch without route-level production verification can change what is prerendered and when a page blocks.",
    "codeOrArtifact": "// Corrected review reference: next.config.ts\nimport type { NextConfig } from 'next';\nconst config:NextConfig={cacheComponents:true};\nexport default config;\n// Audit route-segment configuration and put uncached runtime work behind Suspense.",
    "architectureNotes": "Verification:\n- Build with the new flag in a disposable 16 project.\n- Exercise public, cookie-dependent and dynamic-param routes.\n- Identify unsupported legacy segment options and document a rollback before rollout.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-cache-components-opt-in-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Cache Components is a deliberate Next.js 16 opt-in, not a claim that every 16 application uses the same model. Audit replaced experimental PPR configuration, route-segment options and request-dependent work. A flag switch without route-level production verification can change what is prerendered and when a page blocks.",
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
      "id": "next-lab-cache-components-opt-in-testing",
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
      "id": "next-lab-cache-components-opt-in-security",
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
      "id": "next-lab-cache-components-opt-in-tradeoffs",
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
    "Evaluate route behavior, deployment/cache support and regression evidence first. Adopt in reviewable steps with explicit cache lifetimes and user-isolation tests rather than treating a new framework feature as a universal performance switch."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-cache-components-opt-in-extension",
      "question": "Should you enable it in every app immediately?",
      "expectedConcepts": [
        "Cache Components (16)",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Evaluate route behavior, deployment/cache support and regression evidence first. Adopt in reviewable steps with explicit cache lifetimes and user-isolation tests rather than treating a new framework feature as a universal performance switch."
    }
  ]
}
```
