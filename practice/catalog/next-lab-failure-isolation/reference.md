# Reference: Partition route failures without hiding data integrity errors

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Place Suspense/error boundaries around independently valuable subtrees below shared layouts, and start independent work without a parent waterfall. Give each dependency a bounded deadline and define a visible empty/error/retry state. Keep critical billing authorization and mutation failures distinct from optional notification availability. Preserve the actor/resource context during retry and avoid remounting a whole authenticated shell for background refresh. Correlate failures without exposing sensitive stack details.",
    "architectureNotes": "A fallback can hide an endless request and make a broken page appear merely slow. Track pending age and terminal outcomes, propagate cancellation and alert on sustained failure rather than leaving unbounded spinners.",
    "codeOrArtifact": "# Decision record: Partition route failures without hiding data integrity errors\n\n## Context and scale\nA notification outage turns every account page into a blank loading screen indefinitely.\nDashboard with billing, reports and notifications; dependencies have independent SLOs\n\n## Accepted constraints\n- Keep essential navigation usable.\n- Define which partial failures are tolerable.\n- Preserve error ownership, retry and cancellation.\n\n## Design and ownership\nPlace Suspense/error boundaries around independently valuable subtrees below shared layouts, and start independent work without a parent waterfall. Give each dependency a bounded deadline and define a visible empty/error/retry state. Keep critical billing authorization and mutation failures distinct from optional notification availability. Preserve the actor/resource context during retry and avoid remounting a whole authenticated shell for background refresh. Correlate failures without exposing sensitive stack details.\n\n## Failure and recovery\nA fallback can hide an endless request and make a broken page appear merely slow. Track pending age and terminal outcomes, propagate cancellation and alert on sustained failure rather than leaving unbounded spinners.\n\n## Verification gates\n- Fail each dependency independently and in combinations.\n- Retry after recovery without losing unrelated client state.\n- Test navigation/account changes while old requests remain in flight.\n\n## Interview change\nShould Promise.allSettled replace every error boundary?\nNo. It is a promise-composition tool, not an ownership or UX policy. Decide which partial results are safe and useful, then choose boundaries and response handling that express that decision.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-failure-isolation-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Place Suspense/error boundaries around independently valuable subtrees below shared layouts, and start independent work without a parent waterfall. Give each dependency a bounded deadline and define a visible empty/error/retry state. Keep critical billing authorization and mutation failures distinct from optional notification availability. Preserve the actor/resource context during retry and avoid remounting a whole authenticated shell for background refresh. Correlate failures without exposing sensitive stack details.",
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
      "id": "next-lab-failure-isolation-testing",
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
      "id": "next-lab-failure-isolation-security",
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
      "id": "next-lab-failure-isolation-tradeoffs",
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
    "No. It is a promise-composition tool, not an ownership or UX policy. Decide which partial results are safe and useful, then choose boundaries and response handling that express that decision."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-failure-isolation-extension",
      "question": "Should Promise.allSettled replace every error boundary?",
      "expectedConcepts": [
        "Reliability architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "No. It is a promise-composition tool, not an ownership or UX policy. Decide which partial results are safe and useful, then choose boundaries and response handling that express that decision."
    }
  ]
}
```
