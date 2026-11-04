# Reference: Place useFormStatus inside the form it observes

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The hook observes a parent form’s submission status. Calling it in the component that creates the form does not place that hook inside the form’s descendant tree. Keep the submit control small and test the action path rather than adding an unrelated global loading boolean.",
    "codeOrArtifact": "// Corrected review reference: app/submit-button.tsx\n'use client';\nimport { useFormStatus } from 'react-dom';\nexport default function SubmitButton(){const {pending}=useFormStatus();return <button disabled={pending}>{pending?'Saving…':'Save'}</button>;}\n// Render <SubmitButton/> as a descendant of the parent <form action={serverAction}>.",
    "architectureNotes": "Verification:\n- Render the button inside a parent action form and delay the action.\n- Submit via keyboard and confirm pending disables the button.\n- Render a second independent form and verify statuses remain independent.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-form-status-parent-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "The hook observes a parent form’s submission status. Calling it in the component that creates the form does not place that hook inside the form’s descendant tree. Keep the submit control small and test the action path rather than adding an unrelated global loading boolean.",
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
      "id": "next-lab-form-status-parent-testing",
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
      "id": "next-lab-form-status-parent-security",
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
      "id": "next-lab-form-status-parent-tradeoffs",
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
    "It improves feedback but is not a server concurrency guarantee. Use a database constraint, idempotency policy or transactional operation appropriate to the mutation, and test retries from a forged or repeated request."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-form-status-parent-extension",
      "question": "Does disabling the button prevent duplicate writes?",
      "expectedConcepts": [
        "Mutations and forms",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "It improves feedback but is not a server concurrency guarantee. Use a database constraint, idempotency policy or transactional operation appropriate to the mutation, and test retries from a forged or repeated request."
    }
  ]
}
```
