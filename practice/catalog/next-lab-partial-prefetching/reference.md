# Reference: Adopt modern partial prefetching without losing the initial UI

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The initial UI of a direct load and a client navigation can differ below shared layouts. Partial prefetching changes what the App Shell downloads and reuses; explicit full per-link prefetches remain a budget decision. Instant behavior assumes suitable warm caches, and a root-only Suspense boundary may not contain a destination transition.",
    "codeOrArtifact": "// Corrected review reference: next.config.ts\nimport type { NextConfig } from 'next';\nconst config:NextConfig={cacheComponents:true,partialPrefetching:true};export default config;\n// Audit full per-link prefetches; resolve URL-dependent data behind destination Suspense boundaries.\n// Retain prefetch={true} only where resolving extra URL-specific cached content is an intentional budget decision.",
    "architectureNotes": "Verification:\n- Compare cold direct, warm direct and sibling client navigation.\n- Inspect prefetch requests across many parameterized links.\n- Use the documented instant-navigation assertions/insights to preserve intended initial UI while adopting the flag.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-partial-prefetching-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "The initial UI of a direct load and a client navigation can differ below shared layouts. Partial prefetching changes what the App Shell downloads and reuses; explicit full per-link prefetches remain a budget decision. Instant behavior assumes suitable warm caches, and a root-only Suspense boundary may not contain a destination transition.",
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
      "id": "next-lab-partial-prefetching-testing",
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
      "id": "next-lab-partial-prefetching-security",
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
      "id": "next-lab-partial-prefetching-tradeoffs",
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
    "No. Make the shell useful and stream request-dependent work into correctly placed fallbacks. A prefetch flag cannot repair an unbounded blocking dependency or eliminate cold-cache computation."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-partial-prefetching-extension",
      "question": "Does this make uncached request data instant?",
      "expectedConcepts": [
        "Navigation and performance",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "No. Make the shell useful and stream request-dependent work into correctly placed fallbacks. A prefetch flag cannot repair an unbounded blocking dependency or eliminate cold-cache computation."
    }
  ]
}
```
