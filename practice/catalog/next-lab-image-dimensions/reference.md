# Reference: Reserve image space and constrain remote sources

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Dimensions or a correctly sized fill container establish aspect ratio before the image arrives. A meaningful alt describes the content’s purpose; decorative images use empty alt. A bounded remotePatterns policy is separate from responsive sizing and prevents treating arbitrary user URLs as trusted optimization inputs.",
    "codeOrArtifact": "// Corrected review reference: app/product-image.tsx\nimport Image from 'next/image';\nexport default function ProductImage(){return <Image src=\"https://images.example.com/catalog/product.jpg\" alt=\"Blue insulated bottle\" width={640} height={480} sizes=\"(max-width: 768px) 100vw, 640px\"/>;}\n// next.config.ts: images.remotePatterns must admit only the intended HTTPS host/path.",
    "architectureNotes": "Verification:\n- Configure the exact allowed host and /catalog/** path in the local lab.\n- Verify an off-policy URL is rejected.\n- Measure layout shift and requested image width on mobile and desktop.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-image-dimensions-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Dimensions or a correctly sized fill container establish aspect ratio before the image arrives. A meaningful alt describes the content’s purpose; decorative images use empty alt. A bounded remotePatterns policy is separate from responsive sizing and prevents treating arbitrary user URLs as trusted optimization inputs.",
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
      "id": "next-lab-image-dimensions-testing",
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
      "id": "next-lab-image-dimensions-security",
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
      "id": "next-lab-image-dimensions-tradeoffs",
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
    "The exercise deliberately avoids a version-sensitive loading hint. In 15 inspect priority behavior; in 16 consult the current preload/fetchPriority guidance and avoid preloading competing images indiscriminately. Verify the actual LCP resource and network priority."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-image-dimensions-extension",
      "question": "How does critical-image loading differ in 15 and 16?",
      "expectedConcepts": [
        "Metadata and assets",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "The exercise deliberately avoids a version-sensitive loading hint. In 15 inspect priority behavior; in 16 consult the current preload/fetchPriority guidance and avoid preloading competing images indiscriminately. Verify the actual LCP resource and network priority."
    }
  ]
}
```
