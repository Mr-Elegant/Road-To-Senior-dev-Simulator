# Reference: Control build cost for a million-page catalog

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Measure a representative cold/warm build and enumerate only a bounded valuable set when the deployment model supports on-demand generation. Batch or deduplicate shared build reads, keep origins within concurrency budgets and avoid calling a local Route Handler during prerender. Choose route cache lifetimes and invalidation based on content volatility; a static export is a different deployment with no request-time server fallback. Record how unknown slugs, deletions and origin failures behave before promising arbitrary page coverage.",
    "architectureNotes": "A broad rebuild during an origin incident can turn a serving site into a failed deployment. Retain the last verified artifact and separate deploy-time availability from the ongoing stale/fresh serving policy.",
    "codeOrArtifact": "# Decision record: Control build cost for a million-page catalog\n\n## Context and scale\ngenerateStaticParams enumerates every record and each page performs several serial network calls.\n1,000,000 slugs; 10-minute build budget; origin limited to 100 concurrent reads\n\n## Accepted constraints\n- Bound build time and origin concurrency.\n- Serve useful cold routes.\n- Preserve missing/deleted resource semantics.\n\n## Design and ownership\nMeasure a representative cold/warm build and enumerate only a bounded valuable set when the deployment model supports on-demand generation. Batch or deduplicate shared build reads, keep origins within concurrency budgets and avoid calling a local Route Handler during prerender. Choose route cache lifetimes and invalidation based on content volatility; a static export is a different deployment with no request-time server fallback. Record how unknown slugs, deletions and origin failures behave before promising arbitrary page coverage.\n\n## Failure and recovery\nA broad rebuild during an origin incident can turn a serving site into a failed deployment. Retain the last verified artifact and separate deploy-time availability from the ongoing stale/fresh serving policy.\n\n## Verification gates\n- Run an origin-counted scale sample and extrapolate with measured bottlenecks.\n- Request unenumerated and deleted slugs after deployment.\n- Fail the origin mid-build and test rollback/retained-serving behavior.\n\n## Interview change\nWould increasing worker count always help?\nIt may move the bottleneck to memory, the database or remote rate limits. Increase concurrency only against measured capacity and error/latency budgets; cached inputs and smaller graphs can be more effective.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-large-catalog-build-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Measure a representative cold/warm build and enumerate only a bounded valuable set when the deployment model supports on-demand generation. Batch or deduplicate shared build reads, keep origins within concurrency budgets and avoid calling a local Route Handler during prerender. Choose route cache lifetimes and invalidation based on content volatility; a static export is a different deployment with no request-time server fallback. Record how unknown slugs, deletions and origin failures behave before promising arbitrary page coverage.",
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
      "id": "next-lab-large-catalog-build-testing",
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
      "id": "next-lab-large-catalog-build-security",
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
      "id": "next-lab-large-catalog-build-tradeoffs",
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
    "It may move the bottleneck to memory, the database or remote rate limits. Increase concurrency only against measured capacity and error/latency budgets; cached inputs and smaller graphs can be more effective."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-large-catalog-build-extension",
      "question": "Would increasing worker count always help?",
      "expectedConcepts": [
        "Platform architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "It may move the bottleneck to memory, the database or remote rate limits. Increase concurrency only against measured capacity and error/latency budgets; cached inputs and smaller graphs can be more effective."
    }
  ]
}
```
