# Reference: Design a streaming path through CDN, proxy and server

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Place boundaries below the layouts shared by the relevant navigation, then start only necessary independent work. Trace byte arrival from application through reverse proxy/CDN to the browser; configure supported streaming and inspect compression/buffering behavior. Reserve fallback dimensions and protect private runtime reads. Measure time to useful content rather than equating first byte with a completed interaction. Define how errors after headers commit are represented and observed.",
    "architectureNotes": "After streaming begins, the server cannot reliably replace the committed HTTP status with a later error. Use proper error boundaries and correlation, and avoid promising a 404/500 status from an already-committed successful stream.",
    "codeOrArtifact": "# Decision record: Design a streaming path through CDN, proxy and server\n\n## Context and scale\nSuspense works locally but users receive the entire response only after the slow report finishes.\nThree network hops; p95 useful shell under 400 ms; report data may take 3 seconds\n\n## Accepted constraints\n- Deliver a meaningful initial shell.\n- Identify buffering and compression boundaries.\n- Contain dependency failures without leaking private data.\n\n## Design and ownership\nPlace boundaries below the layouts shared by the relevant navigation, then start only necessary independent work. Trace byte arrival from application through reverse proxy/CDN to the browser; configure supported streaming and inspect compression/buffering behavior. Reserve fallback dimensions and protect private runtime reads. Measure time to useful content rather than equating first byte with a completed interaction. Define how errors after headers commit are represented and observed.\n\n## Failure and recovery\nAfter streaming begins, the server cannot reliably replace the committed HTTP status with a later error. Use proper error boundaries and correlation, and avoid promising a 404/500 status from an already-committed successful stream.\n\n## Verification gates\n- Use a controlled delayed child and capture chunk arrival at each hop.\n- Compare direct loads and sibling client transitions.\n- Break a late dependency and inspect visible recovery, logs and final response status.\n\n## Interview change\nDoes disabling all compression solve it?\nIt can reveal a buffering symptom but is not a complete delivery design. Compare supported proxy settings, payload sizes and actual browser performance before accepting a bandwidth or CPU regression.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-streaming-edge-path-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Place boundaries below the layouts shared by the relevant navigation, then start only necessary independent work. Trace byte arrival from application through reverse proxy/CDN to the browser; configure supported streaming and inspect compression/buffering behavior. Reserve fallback dimensions and protect private runtime reads. Measure time to useful content rather than equating first byte with a completed interaction. Define how errors after headers commit are represented and observed.",
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
      "id": "next-lab-streaming-edge-path-testing",
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
      "id": "next-lab-streaming-edge-path-security",
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
      "id": "next-lab-streaming-edge-path-tradeoffs",
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
    "It can reveal a buffering symptom but is not a complete delivery design. Compare supported proxy settings, payload sizes and actual browser performance before accepting a bandwidth or CPU regression."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-streaming-edge-path-extension",
      "question": "Does disabling all compression solve it?",
      "expectedConcepts": [
        "Delivery architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "It can reveal a buffering symptom but is not a complete delivery design. Compare supported proxy settings, payload sizes and actual browser performance before accepting a bandwidth or CPU regression."
    }
  ]
}
```
