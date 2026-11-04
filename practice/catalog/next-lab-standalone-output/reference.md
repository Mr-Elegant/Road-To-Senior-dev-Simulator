# Reference: Ship a standalone deployment with its required static assets

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Standalone output traces the server dependency subset but static/public asset packaging still needs deliberate handling or an external CDN policy. Test the packaged directory independently of the source checkout so accidental access to local node_modules or public assets does not mask omissions.",
    "codeOrArtifact": "// Corrected review reference: next.config.ts\nimport type { NextConfig } from 'next';\nconst config:NextConfig={output:'standalone'};export default config;\n// Packaging step: copy public into .next/standalone/public and .next/static into .next/standalone/.next/static.\n// Run the generated server.js with the deployment's PORT/HOSTNAME and runtime secrets.",
    "architectureNotes": "Verification:\n- Start the packaged artifact from an isolated directory.\n- Request an HTML route, JS/CSS chunks and public assets.\n- Verify runtime environment configuration and health checks without bundling secrets into NEXT_PUBLIC values.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-standalone-output-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Standalone output traces the server dependency subset but static/public asset packaging still needs deliberate handling or an external CDN policy. Test the packaged directory independently of the source checkout so accidental access to local node_modules or public assets does not mask omissions.",
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
      "id": "next-lab-standalone-output-testing",
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
      "id": "next-lab-standalone-output-security",
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
      "id": "next-lab-standalone-output-tradeoffs",
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
    "Set the intended tracing root and include required files outside the app boundary as documented. Audit the packaged artifact instead of copying the whole repository and assuming that is an efficient or secret-safe deployment."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-standalone-output-extension",
      "question": "How do monorepo file traces change this?",
      "expectedConcepts": [
        "Deployment and runtime",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Set the intended tracing root and include required files outside the app boundary as documented. Audit the packaged artifact instead of copying the whole repository and assuming that is an efficient or secret-safe deployment."
    }
  ]
}
```
