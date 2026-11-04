# Reference: Prevent shared caching of authenticated responses

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Shared-cache admission must depend on the response representation, not merely on using GET. Prefer no-store for personalized or sensitive responses. Vary documents representation inputs but is not authorization and should not be used to justify caching secrets.",
    "codeOrArtifact": "function solution({authenticated,publicResource}){return !authenticated&&publicResource?{cacheControl:'public, max-age=60',vary:[]}:{cacheControl:'private, no-store',vary:['Cookie','Authorization']};}",
    "architectureNotes": "Pure application-policy model. Integrate and verify against the real server separately."
  },
  "rubric": [
    {
      "id": "next-lab-private-response-policy-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Input {authenticated,publicResource}. Return {cacheControl:\"public, max-age=60\",vary:[]} only when authenticated is false and publicResource is true. Otherwise return {cacheControl:\"private, no-store\",vary:[\"Cookie\",\"Authorization\"]}. Both fields are booleans.",
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
      "id": "next-lab-private-response-policy-testing",
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
      "id": "next-lab-private-response-policy-security",
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
      "id": "next-lab-private-response-policy-tradeoffs",
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
    "No. HTTP cache headers and server data caching are different layers. Audit the fetch/use-cache policy, full-route output, CDN overrides and browser behavior independently; test tenant-switch and sign-out flows."
  ],
  "commonMistakes": [
    "Treating a passing model as proof of framework or distributed-system behavior.",
    "Silently coercing values outside the explicitly allowed input policy."
  ],
  "followUps": [
    {
      "id": "next-lab-private-response-policy-extension",
      "question": "Does this control the Next.js Data Cache too?",
      "expectedConcepts": [
        "Changed contract",
        "Boundary evidence",
        "Server ownership"
      ],
      "sampleStrongAnswer": "No. HTTP cache headers and server data caching are different layers. Audit the fetch/use-cache policy, full-route output, CDN overrides and browser behavior independently; test tenant-switch and sign-out flows."
    }
  ]
}
```
