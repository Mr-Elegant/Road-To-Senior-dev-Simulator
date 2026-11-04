# Reference: Choose a runtime compatible with a native database driver

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The Edge runtime does not provide the full Node.js API surface. Choose a supported runtime or replace the dependency with a compatible service. Even in Node, /tmp is ephemeral and instance-local; this reference demonstrates runtime compatibility, not durable cross-instance report storage.",
    "codeOrArtifact": "// Corrected review reference: app/api/report/route.ts\nexport const runtime='nodejs';\nimport { readFile } from 'node:fs/promises';\nexport async function GET(){try{return new Response(await readFile('/tmp/report','utf8'),{headers:{'Cache-Control':'private, no-store'}});}catch{return Response.json({error:'Report unavailable'},{status:503});}}",
    "architectureNotes": "Verification:\n- Build using the target deployment/runtime rather than only a local Node process.\n- Request with a present and absent temporary file.\n- Replace the file source with authorized durable storage for cross-instance requirements.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-runtime-driver-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "The Edge runtime does not provide the full Node.js API surface. Choose a supported runtime or replace the dependency with a compatible service. Even in Node, /tmp is ephemeral and instance-local; this reference demonstrates runtime compatibility, not durable cross-instance report storage.",
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
      "id": "next-lab-runtime-driver-testing",
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
      "id": "next-lab-runtime-driver-security",
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
      "id": "next-lab-runtime-driver-tradeoffs",
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
    "No. Pool size, connection reuse and concurrent instance count still matter. Use an appropriate database proxy/pool strategy and measure connection saturation under scale-out."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-runtime-driver-extension",
      "question": "Does Node runtime remove serverless connection limits?",
      "expectedConcepts": [
        "Deployment and runtime",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "No. Pool size, connection reuse and concurrent instance count still matter. Use an appropriate database proxy/pool strategy and measure connection saturation under scale-out."
    }
  ]
}
```
