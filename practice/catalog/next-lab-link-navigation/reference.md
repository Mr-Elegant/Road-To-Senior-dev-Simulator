# Reference: Preserve accessible client navigation with Link

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "An anchor provides native keyboard, context-menu and modified-click behavior. Link integrates eligible internal navigation with the Next.js router; it does not require making the parent a Client Component. A clickable div with window.location loses those semantics and forces a document navigation.",
    "codeOrArtifact": "// Corrected review reference: app/page.tsx\nimport Link from 'next/link';\nexport default function Page(){return <Link href=\"/products\">Browse products</Link>;}",
    "architectureNotes": "Verification:\n- Navigate using keyboard Enter, ordinary click and a modified click.\n- Check the actual anchor href before hydration.\n- Inspect prefetch traffic in production, where development behavior may differ.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-link-navigation-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "An anchor provides native keyboard, context-menu and modified-click behavior. Link integrates eligible internal navigation with the Next.js router; it does not require making the parent a Client Component. A clickable div with window.location loses those semantics and forces a document navigation.",
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
      "id": "next-lab-link-navigation-testing",
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
      "id": "next-lab-link-navigation-security",
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
      "id": "next-lab-link-navigation-tradeoffs",
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
    "Measure first, then disable prefetch on appropriate links or apply intent-based admission. Disabling prefetch must not disable native navigation or make the route dependent on JavaScript-only click handlers."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-link-navigation-extension",
      "question": "Should a thousand-card catalog prefetch every destination?",
      "expectedConcepts": [
        "Navigation and performance",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Measure first, then disable prefetch on appropriate links or apply intent-based admission. Disabling prefetch must not disable native navigation or make the route dependent on JavaScript-only click handlers."
    }
  ]
}
```
