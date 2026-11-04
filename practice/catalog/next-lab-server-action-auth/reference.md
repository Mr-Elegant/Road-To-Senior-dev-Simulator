# Reference: Authorize every exported Server Action invocation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A Server Action is callable server functionality, not a trusted continuation merely because a hidden button invoked it. Validate the payload and bind the mutation to the authenticated actor at the data layer. Checking ownership in a previous render leaves forged requests and races unaddressed.",
    "codeOrArtifact": "// Corrected review reference: app/actions.ts\n'use server';\nimport { requireUser } from '@/lib/auth';\nimport { deleteOwnedInvoice } from '@/lib/invoices';\nexport async function removeInvoice(id:string){const user=await requireUser();if(!/^[a-z0-9-]{1,64}$/.test(id))return {ok:false};await deleteOwnedInvoice({id,ownerId:user.id});return {ok:true};}\n// deleteOwnedInvoice enforces ownership in its database predicate/transaction.",
    "architectureNotes": "Verification:\n- Invoke as the owner, a different authenticated user and an anonymous caller.\n- Forge an ID not shown by the UI.\n- Verify a failed ownership check changes no record and returns the chosen non-leaking outcome.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-server-action-auth-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A Server Action is callable server functionality, not a trusted continuation merely because a hidden button invoked it. Validate the payload and bind the mutation to the authenticated actor at the data layer. Checking ownership in a previous render leaves forged requests and races unaddressed.",
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
      "id": "next-lab-server-action-auth-testing",
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
      "id": "next-lab-server-action-auth-security",
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
      "id": "next-lab-server-action-auth-tradeoffs",
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
    "No. Action identifiers, closure handling and transport protections do not replace checking current identity and object permission when the action executes."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-server-action-auth-extension",
      "question": "Is an encrypted action closure an authorization policy?",
      "expectedConcepts": [
        "Mutations and forms",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "No. Action identifiers, closure handling and transport protections do not replace checking current identity and object permission when the action executes."
    }
  ]
}
```
