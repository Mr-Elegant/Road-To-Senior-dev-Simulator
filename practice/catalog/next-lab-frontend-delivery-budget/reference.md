# Reference: Reduce JavaScript and prefetch cost without weakening features

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep the full content registry behind server boundaries and pass intentional summary DTOs to client listing controls. Resolve the selected challenge on the server, dynamically load heavy interactive tools when needed, and cache trusted generated runtime assets without rebuilding unchanged inputs. Disable unbounded catalog prefetch where measurements justify it. Separate app build types from unfinished candidate files while retaining full tooling checks. Measure transferred/decoded bytes, interaction latency and cold/warm preparation separately.",
    "architectureNotes": "A summary refactor can accidentally remove search fields, progress IDs or badges. Preserve stable IDs and verify search/readiness parity; keep solutions and fixtures out of listing payloads without dropping user-facing functionality.",
    "codeOrArtifact": "# Decision record: Reduce JavaScript and prefetch cost without weakening features\n\n## Context and scale\nThe dashboard imports full answers, fixtures, editors and compilers for every challenge into its client bundle.\n500 challenge routes; 200 KB compressed initial-route budget; low-end mobile devices\n\n## Accepted constraints\n- Ship summaries for listing/search.\n- Load only selected challenge details.\n- Preserve practice, search and account isolation.\n\n## Design and ownership\nKeep the full content registry behind server boundaries and pass intentional summary DTOs to client listing controls. Resolve the selected challenge on the server, dynamically load heavy interactive tools when needed, and cache trusted generated runtime assets without rebuilding unchanged inputs. Disable unbounded catalog prefetch where measurements justify it. Separate app build types from unfinished candidate files while retaining full tooling checks. Measure transferred/decoded bytes, interaction latency and cold/warm preparation separately.\n\n## Failure and recovery\nA summary refactor can accidentally remove search fields, progress IDs or badges. Preserve stable IDs and verify search/readiness parity; keep solutions and fixtures out of listing payloads without dropping user-facing functionality.\n\n## Verification gates\n- Compare route bundles before/after in production.\n- Verify search, bookmarks, scores and all challenge entry points.\n- Test cache invalidation for changed inputs and missing generated outputs, and profile low-end CPU hydration.\n\n## Interview change\nCan a development timing prove a production performance win?\nIt is useful diagnostic evidence but has different compilation, HMR and transfer characteristics. Report the environment and compare production builds before asserting user-facing production results.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-frontend-delivery-budget-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Keep the full content registry behind server boundaries and pass intentional summary DTOs to client listing controls. Resolve the selected challenge on the server, dynamically load heavy interactive tools when needed, and cache trusted generated runtime assets without rebuilding unchanged inputs. Disable unbounded catalog prefetch where measurements justify it. Separate app build types from unfinished candidate files while retaining full tooling checks. Measure transferred/decoded bytes, interaction latency and cold/warm preparation separately.",
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
      "id": "next-lab-frontend-delivery-budget-testing",
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
      "id": "next-lab-frontend-delivery-budget-security",
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
      "id": "next-lab-frontend-delivery-budget-tradeoffs",
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
    "It is useful diagnostic evidence but has different compilation, HMR and transfer characteristics. Report the environment and compare production builds before asserting user-facing production results."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-frontend-delivery-budget-extension",
      "question": "Can a development timing prove a production performance win?",
      "expectedConcepts": [
        "Platform architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "It is useful diagnostic evidence but has different compilation, HMR and transfer characteristics. Report the environment and compare production builds before asserting user-facing production results."
    }
  ]
}
```
