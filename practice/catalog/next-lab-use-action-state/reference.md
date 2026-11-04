# Reference: Return validation state through React 19 useActionState

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The form action owns submission rather than a click handler that reports success before persistence. useActionState exposes returned serializable validation state and pending status. Client constraints improve usability, while the server function must still validate raw FormData and authorize the mutation.",
    "codeOrArtifact": "// Corrected review reference: app/contact-form.tsx\n'use client';\nimport { useActionState } from 'react';\nimport { saveContact } from './actions';\nexport default function Form(){const [state,action,pending]=useActionState(saveContact,{message:''});return <form action={action}><label>Email<input name=\"email\" type=\"email\" required/></label><button disabled={pending}>Save</button><p role=\"status\">{state.message}</p></form>;}\n// actions.ts exports an authorized server function accepting (previousState, formData) and returning {message:string}.",
    "architectureNotes": "Verification:\n- Implement the stated action contract and submit valid and invalid emails.\n- Verify field errors do not report success.\n- Exercise a pending submission, keyboard submit and a server failure with a defined recovery path.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-use-action-state-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "The form action owns submission rather than a click handler that reports success before persistence. useActionState exposes returned serializable validation state and pending status. Client constraints improve usability, while the server function must still validate raw FormData and authorize the mutation.",
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
      "id": "next-lab-use-action-state-testing",
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
      "id": "next-lab-use-action-state-security",
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
      "id": "next-lab-use-action-state-tradeoffs",
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
    "Test the actual form/action arrangement and documented hydration behavior. Native form semantics help, but a client implementation, external state and redirects can affect the no-JavaScript path; make the product requirement explicit."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-use-action-state-extension",
      "question": "Can JavaScript absence and progressive enhancement be assumed here?",
      "expectedConcepts": [
        "Mutations and forms",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Test the actual form/action arrangement and documented hydration behavior. Native form semantics help, but a client implementation, external state and redirects can affect the no-JavaScript path; make the product requirement explicit."
    }
  ]
}
```
