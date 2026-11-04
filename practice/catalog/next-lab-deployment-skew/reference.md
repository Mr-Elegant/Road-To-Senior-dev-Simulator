# Reference: Handle rolling-deployment client/server version skew

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep immutable build assets available for their supported client lifetime and use the deployment platform’s supported version-skew/affinity strategy where available. Version business payloads and keep additive schema transitions during rolling release. Design user recovery for incompatible action/navigation attempts and avoid silently retrying non-idempotent writes. Observe build/deployment IDs on errors without exposing secrets or assuming a deployment ID alone migrates sessions and data.",
    "architectureNotes": "The CDN may retain an old HTML document while its referenced chunks are deleted. Retain assets through the support window, coordinate cache headers and verify that rollback assets remain fetchable.",
    "codeOrArtifact": "# Decision record: Handle rolling-deployment client/server version skew\n\n## Context and scale\nAn old tab submits an action after the serving deployment has changed and the team assumes every payload is interchangeable.\nLong-lived browser tabs while deployments roll across 20 instances\n\n## Accepted constraints\n- Preserve a usable old-tab experience.\n- Avoid serving mismatched static assets.\n- Plan backward-compatible application payloads.\n\n## Design and ownership\nKeep immutable build assets available for their supported client lifetime and use the deployment platform’s supported version-skew/affinity strategy where available. Version business payloads and keep additive schema transitions during rolling release. Design user recovery for incompatible action/navigation attempts and avoid silently retrying non-idempotent writes. Observe build/deployment IDs on errors without exposing secrets or assuming a deployment ID alone migrates sessions and data.\n\n## Failure and recovery\nThe CDN may retain an old HTML document while its referenced chunks are deleted. Retain assets through the support window, coordinate cache headers and verify that rollback assets remain fetchable.\n\n## Verification gates\n- Open a tab on release A, roll to B, then navigate and mutate.\n- Test mixed instances and a partial deployment rollback.\n- Verify chunk availability, action error handling and mutation idempotency under skew.\n\n## Interview change\nCan you fix all skew with a forced reload?\nReload is a recovery option, not a consistency protocol. Preserve drafts where appropriate, detect incompatibility before repeating writes and retain old assets while managing application/API compatibility.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-deployment-skew-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Keep immutable build assets available for their supported client lifetime and use the deployment platform’s supported version-skew/affinity strategy where available. Version business payloads and keep additive schema transitions during rolling release. Design user recovery for incompatible action/navigation attempts and avoid silently retrying non-idempotent writes. Observe build/deployment IDs on errors without exposing secrets or assuming a deployment ID alone migrates sessions and data.",
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
      "id": "next-lab-deployment-skew-testing",
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
      "id": "next-lab-deployment-skew-security",
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
      "id": "next-lab-deployment-skew-tradeoffs",
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
    "Reload is a recovery option, not a consistency protocol. Preserve drafts where appropriate, detect incompatibility before repeating writes and retain old assets while managing application/API compatibility."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-deployment-skew-extension",
      "question": "Can you fix all skew with a forced reload?",
      "expectedConcepts": [
        "Delivery architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "Reload is a recovery option, not a consistency protocol. Preserve drafts where appropriate, detect incompatibility before repeating writes and retain old assets while managing application/API compatibility."
    }
  ]
}
```
