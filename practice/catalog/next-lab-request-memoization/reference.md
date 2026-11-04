# Reference: Separate React request memoization from persistent caching

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A module Map is process-local, unbounded and may outlive the intended request or tenant context. React cache can deduplicate a shared server function within the relevant render request. It is not durable shared storage, TTL invalidation, or an excuse to omit tenant identity from a query.",
    "codeOrArtifact": "// Corrected review reference: lib/product.ts\nimport 'server-only';\nimport { cache } from 'react';\nimport { loadFromDatabase } from './database';\nexport const getProduct=cache(async(id:string)=>loadFromDatabase(id));",
    "architectureNotes": "Verification:\n- Call the same exported function twice during one server render and count reads.\n- Repeat in a separate request and verify the intended lifecycle.\n- Test tenant/resource keys and error behavior explicitly.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-request-memoization-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A module Map is process-local, unbounded and may outlive the intended request or tenant context. React cache can deduplicate a shared server function within the relevant render request. It is not durable shared storage, TTL invalidation, or an excuse to omit tenant identity from a query.",
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
      "id": "next-lab-request-memoization-testing",
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
      "id": "next-lab-request-memoization-security",
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
      "id": "next-lab-request-memoization-tradeoffs",
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
    "Creating a new cached function for each consumer creates a different memoization identity. Export the wrapper once, and distinguish argument identity from deep structural equality when passing objects."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-request-memoization-extension",
      "question": "Why must consumers share the same exported cache wrapper?",
      "expectedConcepts": [
        "Data fetching",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Creating a new cached function for each consumer creates a different memoization identity. Export the wrapper once, and distinguish argument identity from deep structural equality when passing objects."
    }
  ]
}
```
