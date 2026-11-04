# Reference: Build a retryable route error boundary

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "error.tsx is a Client Component boundary with a reset callback. Show a useful recovery action without exposing server stack traces to users. A boundary catches errors in its child segment; it does not catch an error in its own layout, and it does not replace validation-error handling or authorization.",
    "codeOrArtifact": "// Corrected review reference: app/dashboard/error.tsx\n'use client';\nexport default function ErrorBoundary({reset}:{error:Error&{digest?:string};reset:()=>void}){\n  return <section role=\"alert\"><h2>Dashboard unavailable</h2><p>Try again in a moment.</p><button onClick={()=>reset()}>Retry</button></section>;\n}",
    "architectureNotes": "Verification:\n- Force a child render failure in a production build.\n- Remove the failure and verify Retry recovers the subtree.\n- Verify no server stack, secrets or database query is visible in the error UI.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-error-boundary-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "error.tsx is a Client Component boundary with a reset callback. Show a useful recovery action without exposing server stack traces to users. A boundary catches errors in its child segment; it does not catch an error in its own layout, and it does not replace validation-error handling or authorization.",
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
      "id": "next-lab-error-boundary-testing",
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
      "id": "next-lab-error-boundary-security",
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
      "id": "next-lab-error-boundary-tradeoffs",
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
    "Use global-error.tsx with its own html and body, and test its production behavior. Keep expected action validation in returned serializable state instead of routing every field error through an exception boundary."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-error-boundary-extension",
      "question": "What handles a root layout failure?",
      "expectedConcepts": [
        "Rendering and streaming",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Use global-error.tsx with its own html and body, and test its production behavior. Keep expected action validation in returned serializable state instead of routing every field error through an exception boundary."
    }
  ]
}
```
