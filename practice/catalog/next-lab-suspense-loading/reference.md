# Reference: Place Suspense before the slow work

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A fallback cannot reveal earlier when the parent has already awaited the slow operation. Move the suspending work into the child and wrap that child before it executes. loading.tsx creates a segment-level boundary, while explicit Suspense permits smaller independent reveal regions.",
    "codeOrArtifact": "// Corrected review reference: app/reports/page.tsx\nimport { Suspense } from 'react';\nasync function Report(){await new Promise(resolve=>setTimeout(resolve,800));return <p>Report ready</p>;}\nexport default function Page(){return <><h1>Reports</h1><Suspense fallback={<p role=\"status\">Loading report</p>}><Report/></Suspense></>;}",
    "architectureNotes": "Verification:\n- Use a production server with proxy buffering disabled for the experiment.\n- Confirm the heading/fallback can arrive before report completion.\n- Navigate away during loading and verify the UI remains usable.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-suspense-loading-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A fallback cannot reveal earlier when the parent has already awaited the slow operation. Move the suspending work into the child and wrap that child before it executes. loading.tsx creates a segment-level boundary, while explicit Suspense permits smaller independent reveal regions.",
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
      "id": "next-lab-suspense-loading-testing",
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
      "id": "next-lab-suspense-loading-security",
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
      "id": "next-lab-suspense-loading-tradeoffs",
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
    "No. The largest visible element may still depend on slow work, and an excessive skeleton can shift layout. Measure the actual critical content, reserve dimensions and inspect buffering at every deployment hop."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-suspense-loading-extension",
      "question": "Does streaming necessarily improve LCP?",
      "expectedConcepts": [
        "Rendering and streaming",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "No. The largest visible element may still depend on slow work, and an excessive skeleton can shift layout. Measure the actual critical content, reserve dimensions and inspect buffering at every deployment hop."
    }
  ]
}
```
