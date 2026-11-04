# Reference: Move interactivity into a small Client Component

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "State and event handlers require a client boundary. Put the directive before imports in this leaf module and render it from a Server Component page. Marking the entire root layout client-side expands the dependency graph unnecessarily. Client Components can still participate in the initial server-rendered HTML; client does not mean browser-only rendering.",
    "codeOrArtifact": "// Corrected review reference: app/counter.tsx\n'use client';\nimport { useState } from 'react';\nexport default function Counter(){\n  const [count,setCount]=useState(0);\n  return <button type=\"button\" onClick={()=>setCount(value=>value+1)}>Count: {count}</button>;\n}",
    "architectureNotes": "Verification:\n- Build a Server Component page importing Counter.\n- Click repeatedly and verify the count.\n- Inspect the client graph and confirm the data-access module was not imported.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-client-island-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "State and event handlers require a client boundary. Put the directive before imports in this leaf module and render it from a Server Component page. Marking the entire root layout client-side expands the dependency graph unnecessarily. Client Components can still participate in the initial server-rendered HTML; client does not mean browser-only rendering.",
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
      "id": "next-lab-client-island-testing",
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
      "id": "next-lab-client-island-security",
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
      "id": "next-lab-client-island-tradeoffs",
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
    "Do not import a server-only data component into the client graph. Compose it in a Server Component parent and pass its rendered output through a slot such as children; that preserves ownership of the server work."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-client-island-extension",
      "question": "Can the Client Component import a Server Component?",
      "expectedConcepts": [
        "Server and client boundaries",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Do not import a server-only data component into the client graph. Compose it in a Server Component parent and pass its rendered output through a slot such as children; that preserves ownership of the server work."
    }
  ]
}
```
