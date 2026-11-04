# Reference: Do not swallow redirect control flow in a catch block

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "redirect uses framework control flow that must escape the handler. Catch the fallible business operation, then redirect after the catch region. Do not return success before the write commits, and avoid swallowing other framework control-flow signals in broad application error handling.",
    "codeOrArtifact": "// Corrected review reference: app/actions.ts\n'use server';\nimport { redirect } from 'next/navigation';\nimport { authorizeAndSave } from '@/lib/save';\nexport async function save(){try{await authorizeAndSave();}catch{return {error:'Save failed'};}redirect('/complete');}",
    "architectureNotes": "Verification:\n- Verify success navigates to /complete.\n- Force the business write to fail and verify the action returns its intended error.\n- Inspect action redirect behavior separately from a direct GET redirect.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-redirect-catch-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "redirect uses framework control flow that must escape the handler. Catch the fallible business operation, then redirect after the catch region. Do not return success before the write commits, and avoid swallowing other framework control-flow signals in broad application error handling.",
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
      "id": "next-lab-redirect-catch-testing",
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
      "id": "next-lab-redirect-catch-security",
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
      "id": "next-lab-redirect-catch-tradeoffs",
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
    "It depends on context: Server Action and ordinary render/handler redirects have different semantics. Verify the documented status and method-preservation behavior rather than asserting every redirect is a 302."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-redirect-catch-extension",
      "question": "Which redirect status should you expect?",
      "expectedConcepts": [
        "Mutations and forms",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "It depends on context: Server Action and ordinary render/handler redirects have different semantics. Verify the documented status and method-preservation behavior rather than asserting every redirect is a 302."
    }
  ]
}
```
