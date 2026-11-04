# Reference: Distinguish build-time public environment values from runtime secrets

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A public prefix is an exposure decision, not a runtime injection mechanism. A promoted build can retain its build-time public values even when deployment environment variables change. Read server secrets only on the server and expose an explicit authorized/public configuration projection when runtime-adjustable browser values are required.",
    "codeOrArtifact": "// Corrected review reference: app/config-client.tsx\n// Keep DATABASE_URL server-only; never prefix a secret with NEXT_PUBLIC_.\n// Public NEXT_PUBLIC_* references are inlined at build time, not read afresh after promoting an artifact.\nexport type PublicConfig={supportLabel:string};\nexport function projectConfig(input:{supportLabel:string;databaseUrl:string}):PublicConfig{return {supportLabel:input.supportLabel};}",
    "architectureNotes": "Verification:\n- Build with a sentinel public value, change it at start and inspect the client bundle.\n- Search generated assets for a sentinel secret and prove it is absent.\n- Promote the same artifact between environments and verify the documented runtime/public configuration path.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-public-env-freeze-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A public prefix is an exposure decision, not a runtime injection mechanism. A promoted build can retain its build-time public values even when deployment environment variables change. Read server secrets only on the server and expose an explicit authorized/public configuration projection when runtime-adjustable browser values are required.",
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
      "id": "next-lab-public-env-freeze-testing",
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
      "id": "next-lab-public-env-freeze-security",
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
      "id": "next-lab-public-env-freeze-tradeoffs",
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
    "No. It is not a supported security or runtime configuration strategy. Browser code has no trustworthy secret boundary; use server-side reads and intentionally public DTOs."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-public-env-freeze-extension",
      "question": "Could dynamic process.env indexing be used as a browser secret store?",
      "expectedConcepts": [
        "Deployment and runtime",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "No. It is not a supported security or runtime configuration strategy. Browser code has no trustworthy secret boundary; use server-side reads and intentionally public DTOs."
    }
  ]
}
```
