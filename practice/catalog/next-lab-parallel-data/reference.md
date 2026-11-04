# Reference: Start independent server reads before awaiting them

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Independent reads need not form a waterfall. Start them together while preserving their authorization and resource budgets. Promise.all fails fast as an observed promise result but does not automatically cancel the other work; use independent Suspense boundaries or settled results when partial success is a product requirement.",
    "codeOrArtifact": "// Corrected review reference: app/overview/page.tsx\nimport { getRevenue,getOrders } from '@/lib/overview';\nexport default async function Page(){const [revenue,orders]=await Promise.all([getRevenue(),getOrders()]);return <p>{revenue}: {orders}</p>;}",
    "architectureNotes": "Verification:\n- Delay each fake dependency and compare start/finish traces.\n- Fail one read and confirm the chosen recovery behavior.\n- Load-test the connection pool so parallelizing the page does not overload the database.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-parallel-data-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Independent reads need not form a waterfall. Start them together while preserving their authorization and resource budgets. Promise.all fails fast as an observed promise result but does not automatically cancel the other work; use independent Suspense boundaries or settled results when partial success is a product requirement.",
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
      "id": "next-lab-parallel-data-testing",
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
      "id": "next-lab-parallel-data-security",
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
      "id": "next-lab-parallel-data-tradeoffs",
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
    "Then the dependency is real: preserve ordering or redesign the API to batch the work. Parallelizing dependent operations with guessed inputs trades correctness for misleading timing."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-parallel-data-extension",
      "question": "What if the second read requires the first result?",
      "expectedConcepts": [
        "Data fetching",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Then the dependency is real: preserve ordering or redesign the API to batch the work. Parallelizing dependent operations with guessed inputs trades correctness for misleading timing."
    }
  ]
}
```
