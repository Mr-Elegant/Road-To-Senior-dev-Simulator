# Reference: Migrate a route while App and Pages routers coexist

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Incremental migration can retain both router directories, but a URL must have one intentional owner. Moving the page also changes layout/provider ownership, head management and navigation-hook contracts. Preserve shared business logic and test hard loads and cross-router transitions rather than assuming client state remains mounted across the boundary.",
    "codeOrArtifact": "// Corrected review reference: route-ownership.ts\nexport const routeFiles=['pages/legacy-reports.tsx','app/products/page.tsx'];\n// Own /products in one router. Inventory _app providers, _document markup, next/head and next/router consumers during migration.",
    "architectureNotes": "Verification:\n- Build with one owner for each URL.\n- Compare auth/provider behavior on direct and cross-router navigation.\n- Verify titles, global styles and error/loading behavior after the move.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-router-coexistence-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Incremental migration can retain both router directories, but a URL must have one intentional owner. Moving the page also changes layout/provider ownership, head management and navigation-hook contracts. Preserve shared business logic and test hard loads and cross-router transitions rather than assuming client state remains mounted across the boundary.",
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
      "id": "next-lab-router-coexistence-testing",
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
      "id": "next-lab-router-coexistence-security",
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
      "id": "next-lab-router-coexistence-tradeoffs",
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
    "Use the routing API appropriate to the owner or a deliberate compatibility layer for shared components. App Router hooks expose different contracts; do not conceal the mismatch with casts or a fabricated router object."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-router-coexistence-extension",
      "question": "Can next/router be reused in an App Router client island?",
      "expectedConcepts": [
        "Pages Router and migration",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Use the routing API appropriate to the owner or a deliberate compatibility layer for shared components. App Router hooks expose different contracts; do not conceal the mismatch with casts or a fabricated router object."
    }
  ]
}
```
