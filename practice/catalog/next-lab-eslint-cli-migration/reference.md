# Reference: Preserve lint as an explicit quality gate after next lint removal

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A successful framework build is not evidence that a removed lint step still ran. Keep lint, type checking and production building visible in CI with failure propagation. Avoid passing a build by disabling TypeScript checks or swallowing command exit codes.",
    "codeOrArtifact": "{\"scripts\":{\"lint\":\"eslint src\",\"typecheck\":\"tsc --noEmit\",\"build\":\"next build\",\"check\":\"npm run lint && npm run typecheck && npm run build\"}}",
    "architectureNotes": "Verification:\n- Introduce a known lint violation and prove the check command fails.\n- Introduce a type error and prove the separate gate fails.\n- Restore both and run the production build.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-eslint-cli-migration-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A successful framework build is not evidence that a removed lint step still ran. Keep lint, type checking and production building visible in CI with failure propagation. Avoid passing a build by disabling TypeScript checks or swallowing command exit codes.",
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
      "id": "next-lab-eslint-cli-migration-testing",
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
      "id": "next-lab-eslint-cli-migration-security",
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
      "id": "next-lab-eslint-cli-migration-tradeoffs",
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
    "Choose deliberate project scopes. Exclude candidate practice code from the app build, but retain a separate full tooling/test typecheck so reducing build scope does not silently abandon quality coverage."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-eslint-cli-migration-extension",
      "question": "Should tests and unfinished practice files be in the app typecheck?",
      "expectedConcepts": [
        "Versions and migrations",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Choose deliberate project scopes. Exclude candidate practice code from the app build, but retain a separate full tooling/test typecheck so reducing build scope does not silently abandon quality coverage."
    }
  ]
}
```
