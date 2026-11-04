# Reference: Keep ssr:false inside a client boundary

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A browser-only module may need a no-SSR dynamic import, but that option belongs in a Client Component. Avoid turning a whole data-heavy page into a client module to accommodate one chart. Reserve layout space and consider a useful server fallback for unavailable or slow JavaScript.",
    "codeOrArtifact": "// Corrected review reference: app/chart-client.tsx\n'use client';\nimport dynamic from 'next/dynamic';\nconst Chart=dynamic(()=>import('./browser-chart'),{ssr:false,loading:()=> <p role=\"status\">Loading chart</p>});\nexport default function ChartClient(){return <Chart/>;}\n// Render ChartClient from a server page; keep data fetching in the server layer.",
    "architectureNotes": "Verification:\n- Build with the chart library accessing a browser API at module scope.\n- Verify the loading fallback and eventual interaction.\n- Inspect the client chunks to ensure unrelated server data dependencies were not bundled.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-lazy-browser-library-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A browser-only module may need a no-SSR dynamic import, but that option belongs in a Client Component. Avoid turning a whole data-heavy page into a client module to accommodate one chart. Reserve layout space and consider a useful server fallback for unavailable or slow JavaScript.",
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
      "id": "next-lab-lazy-browser-library-testing",
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
      "id": "next-lab-lazy-browser-library-security",
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
      "id": "next-lab-lazy-browser-library-tradeoffs",
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
    "Usually not just to reduce an initial chunk. Delay work based on user value and measured critical-path behavior; deferring primary content can worsen perceived performance and LCP."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-lazy-browser-library-extension",
      "question": "Would you lazy-load the LCP hero?",
      "expectedConcepts": [
        "Navigation and performance",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Usually not just to reduce an initial chunk. Delay work based on user value and measured critical-path behavior; deferring primary content can worsen perceived performance and LCP."
    }
  ]
}
```
