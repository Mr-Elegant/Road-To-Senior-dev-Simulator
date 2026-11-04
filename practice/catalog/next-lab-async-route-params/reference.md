# Reference: Migrate dynamic route params from 15 compatibility to 16

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Update the route-prop type and implementation together. Await before reading id, then validate it according to the resource contract. The asynchronous boundary is not solved by casting away the promise or suppressing diagnostics; those approaches conceal a runtime migration problem.",
    "codeOrArtifact": "// Corrected review reference: app/products/[id]/page.tsx\nexport default async function Page({params}: {params:Promise<{id:string}>}) {\n  const {id}=await params;\n  return <h1>Product {id}</h1>;\n}",
    "architectureNotes": "Verification:\n- Build a dynamic route and directly request /products/abc.\n- Verify generated route types accept the promised params signature.\n- Test a missing resource separately from an invalid identifier.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-async-route-params-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Update the route-prop type and implementation together. Await before reading id, then validate it according to the resource contract. The asynchronous boundary is not solved by casting away the promise or suppressing diagnostics; those approaches conceal a runtime migration problem.",
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
      "id": "next-lab-async-route-params-testing",
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
      "id": "next-lab-async-route-params-security",
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
      "id": "next-lab-async-route-params-tradeoffs",
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
    "Their dynamic params are also asynchronous in the migration. Update page, layout, route and metadata consumers consistently; next typegen can help validate generated contracts on supported versions."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-async-route-params-extension",
      "question": "What changes for Route Handlers and metadata?",
      "expectedConcepts": [
        "Routing and URL state",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Their dynamic params are also asynchronous in the migration. Update page, layout, route and metadata consumers consistently; next typegen can help validate generated contracts on supported versions."
    }
  ]
}
```
