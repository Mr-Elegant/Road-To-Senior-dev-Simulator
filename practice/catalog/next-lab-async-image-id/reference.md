# Reference: Await the generated image id during the 16 migration

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "An image-generation function is part of the route migration surface, not an exemption from asynchronous prop changes. Keep generated metadata IDs aligned with the consuming image function and verify real image bytes, content type and dimensions rather than merely type-checking the source.",
    "codeOrArtifact": "// Corrected review reference: app/icon.tsx\nimport { ImageResponse } from 'next/og';\nexport function generateImageMetadata(){return [{id:'primary',size:{width:64,height:64},contentType:'image/png'}];}\nexport default async function Icon({id}:{id:Promise<string>}){const variant=await id;return new ImageResponse(<div style={{display:'flex',fontSize:20}}>{variant==='primary'?'P':'?'}</div>,{width:64,height:64});}",
    "architectureNotes": "Verification:\n- Build and request the generated icon URL.\n- Decode the returned image and confirm 64×64 pixels.\n- Test every declared metadata variant and the dynamic params contract if present.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-async-image-id-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "An image-generation function is part of the route migration surface, not an exemption from asynchronous prop changes. Keep generated metadata IDs aligned with the consuming image function and verify real image bytes, content type and dimensions rather than merely type-checking the source.",
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
      "id": "next-lab-async-image-id-testing",
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
      "id": "next-lab-async-image-id-security",
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
      "id": "next-lab-async-image-id-tradeoffs",
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
    "Image generation is a server-side resource consumer. Bound destinations, response sizes, timeouts and rendering work; treat user text and URLs as untrusted inputs rather than unrestricted server fetch instructions."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-async-image-id-extension",
      "question": "Why avoid fetching arbitrary user URLs while generating OG images?",
      "expectedConcepts": [
        "Versions and migrations",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Image generation is a server-side resource consumer. Bound destinations, response sizes, timeouts and rendering work; treat user text and URLs as untrusted inputs rather than unrestricted server fetch instructions."
    }
  ]
}
```
