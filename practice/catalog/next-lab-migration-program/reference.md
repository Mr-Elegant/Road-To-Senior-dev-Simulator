# Reference: Plan a reversible Next.js 15-to-16 production migration

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Capture the exact patched baseline, route inventory, build timings, error rate and critical browser journeys. First migrate async request APIs and remove hidden lint/build assumptions while still on 15. In a separate change switch the major and explicitly review Proxy naming, generated metadata props and custom bundler behavior. Keep Cache Components/partial prefetching adoption as deliberate later rendering changes unless required. Run direct and soft navigation, authorization, cache-isolation and packaged-deployment tests, then stage traffic with automatic rollback gates.",
    "architectureNotes": "A rollback of code may encounter data written by the new release. Use backward-compatible schema transitions and versioned payloads; record which changes can actually be reversed rather than equating redeployment with full system rollback.",
    "codeOrArtifact": "# Decision record: Plan a reversible Next.js 15-to-16 production migration\n\n## Context and scale\nThe team proposes upgrading Next, React, bundler, authentication and caching in one unreviewed commit.\n400 routes; ten teams; zero planned downtime; existing 15.x production deployment\n\n## Accepted constraints\n- Inventory version-sensitive surfaces.\n- Retain a tested rollback artifact.\n- Separate behavioral compatibility from performance adoption.\n\n## Design and ownership\nCapture the exact patched baseline, route inventory, build timings, error rate and critical browser journeys. First migrate async request APIs and remove hidden lint/build assumptions while still on 15. In a separate change switch the major and explicitly review Proxy naming, generated metadata props and custom bundler behavior. Keep Cache Components/partial prefetching adoption as deliberate later rendering changes unless required. Run direct and soft navigation, authorization, cache-isolation and packaged-deployment tests, then stage traffic with automatic rollback gates.\n\n## Failure and recovery\nA rollback of code may encounter data written by the new release. Use backward-compatible schema transitions and versioned payloads; record which changes can actually be reversed rather than equating redeployment with full system rollback.\n\n## Verification gates\n- Compare route status/head/header behavior against the baseline.\n- Run both version production fixtures.\n- Exercise rollback under the same data and cache compatibility assumptions used during rollout.\n\n## Interview change\nWould you use canary as the meaning of latest?\nNo for this curriculum’s stable baseline. Record stable version and patch support explicitly; evaluate canary features in isolated experiments with separate expectations and rollback, not as an implicit production upgrade.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-migration-program-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Capture the exact patched baseline, route inventory, build timings, error rate and critical browser journeys. First migrate async request APIs and remove hidden lint/build assumptions while still on 15. In a separate change switch the major and explicitly review Proxy naming, generated metadata props and custom bundler behavior. Keep Cache Components/partial prefetching adoption as deliberate later rendering changes unless required. Run direct and soft navigation, authorization, cache-isolation and packaged-deployment tests, then stage traffic with automatic rollback gates.",
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
      "id": "next-lab-migration-program-testing",
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
      "id": "next-lab-migration-program-security",
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
      "id": "next-lab-migration-program-tradeoffs",
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
    "No for this curriculum’s stable baseline. Record stable version and patch support explicitly; evaluate canary features in isolated experiments with separate expectations and rollback, not as an implicit production upgrade."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-migration-program-extension",
      "question": "Would you use canary as the meaning of latest?",
      "expectedConcepts": [
        "Platform architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "No for this curriculum’s stable baseline. Record stable version and patch support explicitly; evaluate canary features in isolated experiments with separate expectations and rollback, not as an implicit production upgrade."
    }
  ]
}
```
