# Reference: Replace a non-serializable event prop across the boundary

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "An ordinary server-created callback cannot be serialized as a client event handler. Keep the interactive callback in a Client Component and pass supported data props. Server Actions are a specific server-function capability, not a general exception allowing arbitrary closures to cross the boundary.",
    "codeOrArtifact": "// Corrected review reference: app/page.tsx\n// app/page.tsx (Server Component)\nimport Button from './button';\nexport default function Page(){ return <Button label=\"Save draft\" />; }\n// app/button.tsx is a separate file:\n// 'use client';\n// export default function Button({label}:{label:string}) {\n//   return <button onClick={()=>console.log('clicked')}>{label}</button>;\n// }",
    "architectureNotes": "Verification:\n- Split the two files at the annotated boundary and build.\n- Confirm the button works after hydration.\n- Verify no sensitive object fields are included in the props payload.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-client-prop-contract-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "An ordinary server-created callback cannot be serialized as a client event handler. Keep the interactive callback in a Client Component and pass supported data props. Server Actions are a specific server-function capability, not a general exception allowing arbitrary closures to cross the boundary.",
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
      "id": "next-lab-client-prop-contract-testing",
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
      "id": "next-lab-client-prop-contract-security",
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
      "id": "next-lab-client-prop-contract-tradeoffs",
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
    "Do not reduce the RSC serialization contract to JSON-only folklore. React supports specific richer values; check its current supported types. Still prefer an intentional DTO and avoid arbitrary class instances or ordinary function props."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-client-prop-contract-extension",
      "question": "Are Dates always forbidden as RSC props?",
      "expectedConcepts": [
        "Server and client boundaries",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Do not reduce the RSC serialization contract to JSON-only folklore. React supports specific richer values; check its current supported types. Still prefer an intentional DTO and avoid arbitrary class instances or ordinary function props."
    }
  ]
}
```
