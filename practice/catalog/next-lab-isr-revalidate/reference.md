# Reference: Set a deliberate ISR window without contradictory fetch options

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "no-store contradicts a persistent revalidation window. Choose a single freshness policy, then measure the origin reads and stale-serving behavior across the time boundary. This reference targets the non-Cache-Components model; rebuilding, data revalidation and router refresh are different operations.",
    "codeOrArtifact": "// Corrected review reference: app/news/page.tsx\nexport default async function Page(){const response=await fetch('https://news.example.com/public',{next:{revalidate:60,tags:['public-news']}});if(!response.ok)throw new Error('News unavailable');return <pre>{await response.text()}</pre>;}",
    "architectureNotes": "Verification:\n- Run a production build and multiple requests before and after the window.\n- Introduce an origin failure during revalidation and inspect the served version.\n- Record which layer stores data and which stores route output.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-isr-revalidate-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "no-store contradicts a persistent revalidation window. Choose a single freshness policy, then measure the origin reads and stale-serving behavior across the time boundary. This reference targets the non-Cache-Components model; rebuilding, data revalidation and router refresh are different operations.",
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
      "id": "next-lab-isr-revalidate-testing",
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
      "id": "next-lab-isr-revalidate-security",
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
      "id": "next-lab-isr-revalidate-tradeoffs",
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
    "Not for the authoritative admission decision. Cached catalog availability can be advisory, but the reservation must be validated atomically against current inventory in the system of record."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-isr-revalidate-extension",
      "question": "Would you use a 60-second window for inventory reservations?",
      "expectedConcepts": [
        "Caching and revalidation",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Not for the authoritative admission decision. Cached catalog availability can be advisory, but the reservation must be validated atomically against current inventory in the system of record."
    }
  ]
}
```
