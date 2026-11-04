# Reference: Build an actionable Next.js latency and reliability SLO

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Define successful operations, excluded conditions and a measurement window before choosing an error budget. Collect real-user navigation/LCP/interaction signals, server route/action traces, dependency duration and cache hit/age data with correlated request and deployment IDs. Segment by region and route family, sample responsibly and redact sensitive attributes. Alert on burn rate and sustained user impact, with runbooks that distinguish origin latency, buffering, hydration, session gates and cache misses.",
    "architectureNotes": "A global average can hide a tenant-specific outage or a cold-cache tail. Preserve bounded-cardinality cohorts and inspect distributions; do not attach arbitrary user emails or full URLs as unbounded metric labels.",
    "codeOrArtifact": "# Decision record: Build an actionable Next.js latency and reliability SLO\n\n## Context and scale\nThe only metric is next build duration, yet users report slow navigation and intermittent action failures.\np95 route interaction under 1 second; 99.9% successful authenticated operations\n\n## Accepted constraints\n- Measure user-visible and server dependency boundaries.\n- Separate cold/warm and direct/soft navigation.\n- Link alerts to operational response.\n\n## Design and ownership\nDefine successful operations, excluded conditions and a measurement window before choosing an error budget. Collect real-user navigation/LCP/interaction signals, server route/action traces, dependency duration and cache hit/age data with correlated request and deployment IDs. Segment by region and route family, sample responsibly and redact sensitive attributes. Alert on burn rate and sustained user impact, with runbooks that distinguish origin latency, buffering, hydration, session gates and cache misses.\n\n## Failure and recovery\nA global average can hide a tenant-specific outage or a cold-cache tail. Preserve bounded-cardinality cohorts and inspect distributions; do not attach arbitrary user emails or full URLs as unbounded metric labels.\n\n## Verification gates\n- Inject latency separately into auth, database and client code.\n- Confirm an alert points to useful diagnostic evidence and a bounded mitigation.\n- Compare cold/warm and direct/client navigation measurements without combining unlike events.\n\n## Interview change\nWould more telemetry always improve diagnosis?\nUnbounded logs and high-cardinality metrics can create cost, privacy and reliability problems. Instrument a causal model with useful sampling and retention, and measure the telemetry pipeline’s own failure behavior.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-observability-slo-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Define successful operations, excluded conditions and a measurement window before choosing an error budget. Collect real-user navigation/LCP/interaction signals, server route/action traces, dependency duration and cache hit/age data with correlated request and deployment IDs. Segment by region and route family, sample responsibly and redact sensitive attributes. Alert on burn rate and sustained user impact, with runbooks that distinguish origin latency, buffering, hydration, session gates and cache misses.",
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
      "id": "next-lab-observability-slo-testing",
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
      "id": "next-lab-observability-slo-security",
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
      "id": "next-lab-observability-slo-tradeoffs",
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
    "Unbounded logs and high-cardinality metrics can create cost, privacy and reliability problems. Instrument a causal model with useful sampling and retention, and measure the telemetry pipeline’s own failure behavior."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-observability-slo-extension",
      "question": "Would more telemetry always improve diagnosis?",
      "expectedConcepts": [
        "Reliability architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "Unbounded logs and high-cardinality metrics can create cost, privacy and reliability problems. Instrument a causal model with useful sampling and retention, and measure the telemetry pipeline’s own failure behavior."
    }
  ]
}
```
