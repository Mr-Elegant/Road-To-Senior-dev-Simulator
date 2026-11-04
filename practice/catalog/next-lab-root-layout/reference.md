# Reference: Repair the App Router root layout

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The root layout owns html and body; a nested layout must not create a second document. Keep shared navigation here while allowing page content to render through children. A layout persists across ordinary client navigation, so it is a poor place to derive a continuously changing pathname from server-only props.",
    "codeOrArtifact": "// Corrected review reference: app/layout.tsx\nimport type { ReactNode } from 'react';\nexport default function RootLayout({ children }: { children: ReactNode }) {\n  return <html lang=\"en\"><body><nav aria-label=\"Main\">Engineering Lab</nav><main>{children}</main></body></html>;\n}",
    "architectureNotes": "Verification:\n- Build with a real root page and verify one html/body pair.\n- Navigate between two sibling pages and verify shared client state persists.\n- Reload a nested URL directly and verify the same shell.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-root-layout-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "The root layout owns html and body; a nested layout must not create a second document. Keep shared navigation here while allowing page content to render through children. A layout persists across ordinary client navigation, so it is a poor place to derive a continuously changing pathname from server-only props.",
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
      "id": "next-lab-root-layout-testing",
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
      "id": "next-lab-root-layout-security",
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
      "id": "next-lab-root-layout-tradeoffs",
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
    "A template remounts its children during navigation and resets their state/effects. Use it for deliberate per-navigation lifecycle behavior, not as a workaround for stale authorization. Put authorization near protected data reads."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-root-layout-extension",
      "question": "When would you use template.tsx instead?",
      "expectedConcepts": [
        "App Router foundations",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "A template remounts its children during navigation and resets their state/effects. Use it for deliberate per-navigation lifecycle behavior, not as a workaround for stale authorization. Put authorization near protected data reads."
    }
  ]
}
```
