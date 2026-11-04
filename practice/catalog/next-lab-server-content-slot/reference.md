# Reference: Compose server-fetched content through a client slot

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A server parent owns the server data component and passes rendered content into the interactive client container. The client module does not import the server-only dependency. Remember that rendered content sent to a browser is visible to that browser, even while collapsed; a toggle is not a permission boundary.",
    "codeOrArtifact": "// Corrected review reference: app/page.tsx\nimport TogglePanel from './toggle-panel';\nimport SecretReport from './secret-report';\nexport default function Page(){return <TogglePanel><SecretReport/></TogglePanel>;}\n// toggle-panel.tsx is a client leaf accepting children: React.ReactNode.\n// secret-report.tsx remains a server module and authorizes its own data read.",
    "architectureNotes": "Verification:\n- Mark the report data module server-only and build.\n- Verify the toggle remains interactive.\n- Inspect the initial payload and prove no unauthorized or secret report is sent.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-server-content-slot-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A server parent owns the server data component and passes rendered content into the interactive client container. The client module does not import the server-only dependency. Remember that rendered content sent to a browser is visible to that browser, even while collapsed; a toggle is not a permission boundary.",
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
      "id": "next-lab-server-content-slot-testing",
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
      "id": "next-lab-server-content-slot-security",
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
      "id": "next-lab-server-content-slot-tradeoffs",
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
    "Authorize before the read, close to the data source. If the product requires explicit lazy retrieval, design an authenticated read boundary and state flow rather than assuming hidden children are never evaluated."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-server-content-slot-extension",
      "question": "How do you avoid fetching a report until it is authorized?",
      "expectedConcepts": [
        "Server and client boundaries",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Authorize before the read, close to the data source. If the product requires explicit lazy retrieval, design an authenticated read boundary and state flow rather than assuming hidden children are never evaluated."
    }
  ]
}
```
