# Reference: Provide a hard-navigation fallback for a parallel slot

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A parallel slot’s active state during soft navigation may not be recoverable on a full load. Provide the intended default fallback and consider the implicit children slot as well. A slot is not a URL segment; guessing its active subpage on refresh can produce an unexpected 404 or incorrect content.",
    "codeOrArtifact": "// Corrected review reference: app/dashboard/@analytics/default.tsx\nexport default function AnalyticsDefault(){return <p>Choose a report to load analytics.</p>;}",
    "architectureNotes": "Verification:\n- Navigate softly into an analytics subpage.\n- Reload a sibling URL directly and inspect the fallback.\n- Verify children and each named slot have deliberate unmatched-route behavior.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-parallel-slot-default-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A parallel slot’s active state during soft navigation may not be recoverable on a full load. Provide the intended default fallback and consider the implicit children slot as well. A slot is not a URL segment; guessing its active subpage on refresh can produce an unexpected 404 or incorrect content.",
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
      "id": "next-lab-parallel-slot-default-testing",
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
      "id": "next-lab-parallel-slot-default-security",
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
      "id": "next-lab-parallel-slot-default-tradeoffs",
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
    "No. Authorize its underlying read and any actions independently. Slot visibility and navigation state are presentation concerns, not access controls."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-parallel-slot-default-extension",
      "question": "Should a privileged slot rely on being hidden?",
      "expectedConcepts": [
        "Routing composition",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "No. Authorize its underlying read and any actions independently. Slot visibility and navigation state are presentation concerns, not access controls."
    }
  ]
}
```
