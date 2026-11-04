# Reference: Design a versioned Next.js regression and release matrix

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use unit tests for pure input policies and curriculum integrity, production-server tests for routing/metadata/headers/actions/streaming, and deployment integration for CDN/cache handlers/queues/databases. Pin patched 15 and stable 16 in isolated fixtures, with cache/config assumptions in the test names. Keep cold/warm and direct/soft-navigation cases separate. Validate the simulator’s own browser flows and content exports without claiming those checks execute every infrastructure design. Store source links, version snapshot and known verification limits with the curriculum.",
    "architectureNotes": "An always-green mock can conceal an unsupported API or a server cache leak. Introduce deliberate negative fixtures, assert real HTTP/output evidence and fail unsupported claims rather than manufacturing a passing score for guided work.",
    "codeOrArtifact": "# Decision record: Design a versioned Next.js regression and release matrix\n\n## Context and scale\nA unit suite of policy models is labeled proof that every routing, cache and deployment behavior works on both major versions.\nSupported Next.js 15 maintenance and 16 stable; 100 practice scenarios\n\n## Accepted constraints\n- Keep exact policy tests cheap and deterministic.\n- Verify representative real framework boundaries on both versions.\n- Record unperformed integration claims honestly.\n\n## Design and ownership\nUse unit tests for pure input policies and curriculum integrity, production-server tests for routing/metadata/headers/actions/streaming, and deployment integration for CDN/cache handlers/queues/databases. Pin patched 15 and stable 16 in isolated fixtures, with cache/config assumptions in the test names. Keep cold/warm and direct/soft-navigation cases separate. Validate the simulator’s own browser flows and content exports without claiming those checks execute every infrastructure design. Store source links, version snapshot and known verification limits with the curriculum.\n\n## Failure and recovery\nAn always-green mock can conceal an unsupported API or a server cache leak. Introduce deliberate negative fixtures, assert real HTTP/output evidence and fail unsupported claims rather than manufacturing a passing score for guided work.\n\n## Verification gates\n- Run the supported-version fixtures from clean installs and production builds.\n- Mutate a policy/reference to prove the intended check fails.\n- Audit report wording against actual executed checks and retained evidence.\n\n## Interview change\nShould latest be an unpinned CI dependency?\nUse a reviewed pinned release matrix and a separate dependency-update job. Unbounded latest installs can change the baseline silently; record exactly what was tested and refresh the version snapshot deliberately.\n\n## Evidence boundary\nThis artifact is a reference design. It is not a claim of deployed, concurrent or multi-region verification."
  },
  "rubric": [
    {
      "id": "next-lab-test-pyramid-versions-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Use unit tests for pure input policies and curriculum integrity, production-server tests for routing/metadata/headers/actions/streaming, and deployment integration for CDN/cache handlers/queues/databases. Pin patched 15 and stable 16 in isolated fixtures, with cache/config assumptions in the test names. Keep cold/warm and direct/soft-navigation cases separate. Validate the simulator’s own browser flows and content exports without claiming those checks execute every infrastructure design. Store source links, version snapshot and known verification limits with the curriculum.",
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
      "id": "next-lab-test-pyramid-versions-testing",
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
      "id": "next-lab-test-pyramid-versions-security",
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
      "id": "next-lab-test-pyramid-versions-tradeoffs",
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
    "Use a reviewed pinned release matrix and a separate dependency-update job. Unbounded latest installs can change the baseline silently; record exactly what was tested and refresh the version snapshot deliberately."
  ],
  "commonMistakes": [
    "Claiming a cache API provides transactions, durable delivery or cross-region consistency.",
    "Omitting authorization, recovery budgets or evidence from an otherwise attractive component diagram."
  ],
  "followUps": [
    {
      "id": "next-lab-test-pyramid-versions-extension",
      "question": "Should latest be an unpinned CI dependency?",
      "expectedConcepts": [
        "Platform architecture",
        "Consistency and ownership",
        "Measurable evidence"
      ],
      "sampleStrongAnswer": "Use a reviewed pinned release matrix and a separate dependency-update job. Unbounded latest installs can change the baseline silently; record exactly what was tested and refresh the version snapshot deliberately."
    }
  ]
}
```
