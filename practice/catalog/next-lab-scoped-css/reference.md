# Reference: Scope a component style without global collisions

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A generic global class can collide with unrelated route content, particularly as layouts persist and styles accumulate. CSS Modules scope component classes while root global styles retain their deliberate application-wide role. Style scoping is not a reason to move server-rendered content into the client graph.",
    "codeOrArtifact": "// Corrected review reference: app/card.tsx\nimport styles from './card.module.css';\nexport default function Card(){return <article className={styles.title}>Invoice</article>;}\n// card.module.css is a separate file containing: .title { padding: 1rem; border: 1px solid currentColor; }",
    "architectureNotes": "Verification:\n- Render a second component that uses an unrelated title class.\n- Navigate between routes repeatedly and compare computed styles.\n- Build production output and verify generated module class names are applied.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-scoped-css-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A generic global class can collide with unrelated route content, particularly as layouts persist and styles accumulate. CSS Modules scope component classes while root global styles retain their deliberate application-wide role. Style scoping is not a reason to move server-rendered content into the client graph.",
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
      "id": "next-lab-scoped-css-testing",
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
      "id": "next-lab-scoped-css-security",
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
      "id": "next-lab-scoped-css-tradeoffs",
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
    "For intentional resets, typography variables, theme tokens and global utilities. Define ownership and order rather than converting every reusable token into a private module."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-scoped-css-extension",
      "question": "When would you keep a global stylesheet?",
      "expectedConcepts": [
        "App Router foundations",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "For intentional resets, typography variables, theme tokens and global utilities. Define ownership and order rather than converting every reusable token into a private module."
    }
  ]
}
```
