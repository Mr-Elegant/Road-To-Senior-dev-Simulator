# Reference: Model cache freshness at exact time boundaries

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use half-open intervals so each timestamp has one state. Stale data may be an explicit product choice; expired data needs a different blocking or failure policy. The model omits distributed clocks, fetch duration and client stale lifetimes.",
    "codeOrArtifact": "function solution({age,revalidate,expire}){return age<revalidate?'fresh':age<expire?'stale':'expired';}",
    "architectureNotes": "Pure application-policy model. Integrate and verify against the real server separately."
  },
  "rubric": [
    {
      "id": "next-lab-cache-freshness-model-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Input {age,revalidate,expire} contains nonnegative finite seconds with revalidate <= expire. Return fresh when age < revalidate, stale when revalidate <= age < expire, otherwise expired. This is a simplified policy, not all cacheLife fields.",
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
      "id": "next-lab-cache-freshness-model-testing",
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
      "id": "next-lab-cache-freshness-model-security",
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
      "id": "next-lab-cache-freshness-model-tradeoffs",
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
    "Define a bounded stale-if-error policy, mark the served version and monitor its age. For authorization, pricing or revoked entitlements, stale service may violate correctness even when availability improves."
  ],
  "commonMistakes": [
    "Treating a passing model as proof of framework or distributed-system behavior.",
    "Silently coercing values outside the explicitly allowed input policy."
  ],
  "followUps": [
    {
      "id": "next-lab-cache-freshness-model-extension",
      "question": "Can you serve stale data after the origin fails?",
      "expectedConcepts": [
        "Changed contract",
        "Boundary evidence",
        "Server ownership"
      ],
      "sampleStrongAnswer": "Define a bounded stale-if-error policy, mark the served version and monitor its age. For authorization, pricing or revoked entitlements, stale service may violate correctness even when availability improves."
    }
  ]
}
```
