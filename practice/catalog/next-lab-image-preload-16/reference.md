# Reference: Migrate a critical image loading hint with measured intent

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Loading hints are a resource-priority decision, not a badge to apply to every image. Correct dimensions and sizes remain necessary. This reference uses a single known hero on 16; responsive variants or multiple possible LCP candidates need an intentional network policy.",
    "codeOrArtifact": "// Corrected review reference: app/hero.tsx\nimport Image from 'next/image';\nexport default function Hero(){return <Image src=\"/hero.jpg\" alt=\"Product workspace\" width={1200} height={800} sizes=\"100vw\" preload/>;}\n// Supply public/hero.jpg; use this 16-specific preload only for the deliberate critical image.",
    "architectureNotes": "Verification:\n- Inspect the head preload and image request in a production build.\n- Compare LCP and bandwidth on a small viewport.\n- Verify below-the-fold images do not all receive the same critical hint.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-image-preload-16-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Loading hints are a resource-priority decision, not a badge to apply to every image. Correct dimensions and sizes remain necessary. This reference uses a single known hero on 16; responsive variants or multiple possible LCP candidates need an intentional network policy.",
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
      "id": "next-lab-image-preload-16-testing",
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
      "id": "next-lab-image-preload-16-security",
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
      "id": "next-lab-image-preload-16-tradeoffs",
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
    "Avoid preloading a resource before you know it will be used. Measure which representation becomes LCP and consider fetchPriority or eager loading where the current docs recommend them."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-image-preload-16-extension",
      "question": "What if the hero depends on a user preference?",
      "expectedConcepts": [
        "Metadata and assets",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Avoid preloading a resource before you know it will be used. Measure which representation becomes LCP and consider fetchPriority or eager loading where the current docs recommend them."
    }
  ]
}
```
