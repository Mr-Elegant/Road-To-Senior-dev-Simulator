# Reference: Keep authorization when a Proxy matcher excludes an action path

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A matcher change or moving a Server Action to another route can change routing-layer coverage. An action still needs its own current capability check and tenant-scoped read. Filtering the final response client-side is too late once customer data has crossed the browser boundary.",
    "codeOrArtifact": "// Corrected review reference: app/public-actions.ts\n'use server';\nimport { requireCapability } from '@/lib/auth';\nimport { listTenantCustomerExport } from '@/lib/customers';\nexport async function exportCustomers(){const actor=await requireCapability('customers:export');return listTenantCustomerExport(actor.tenantId);}",
    "architectureNotes": "Verification:\n- Invoke the action from its actual route as an unauthorized caller.\n- Move the action’s call site outside the matcher in a disposable lab.\n- Verify the protected export remains tenant-scoped in both versions.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-matcher-security-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A matcher change or moving a Server Action to another route can change routing-layer coverage. An action still needs its own current capability check and tenant-scoped read. Filtering the final response client-side is too late once customer data has crossed the browser boundary.",
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
      "id": "next-lab-matcher-security-testing",
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
      "id": "next-lab-matcher-security-security",
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
      "id": "next-lab-matcher-security-tradeoffs",
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
    "Centralize an explicit authorized data-access operation or capability policy and invoke it from every entry point. Centralization should reduce duplication without hiding which actor and object scope a call uses."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-matcher-security-extension",
      "question": "How do you keep policies consistent across entry points?",
      "expectedConcepts": [
        "Security and identity",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Centralize an explicit authorized data-access operation or capability policy and invoke it from every entry point. Centralization should reduce duplication without hiding which actor and object scope a call uses."
    }
  ]
}
```
