# Reference: Audit a custom Webpack hook before a Turbopack build

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A bundler switch can change module resolution, loaders and emitted assets even when TypeScript succeeds. Inventory every custom hook and translate only supported behavior. An explicit Webpack fallback is a rollback option when tested; silently dropping an alias is not a migration.",
    "codeOrArtifact": "// Corrected review reference: next.config.ts\nimport type { NextConfig } from 'next';\nconst config:NextConfig={turbopack:{resolveAlias:{'legacy-parser':'./parser'}}};\nexport default config;\n// Validate this alias against the actual parser module; retain an explicit webpack build only as a tested fallback.",
    "architectureNotes": "Verification:\n- Build and execute an import that depends on the alias.\n- Compare development and production resolution.\n- Check loaders, Sass imports and source maps used by the real app before retiring the fallback.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-turbopack-webpack-config-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A bundler switch can change module resolution, loaders and emitted assets even when TypeScript succeeds. Inventory every custom hook and translate only supported behavior. An explicit Webpack fallback is a rollback option when tested; silently dropping an alias is not a migration.",
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
      "id": "next-lab-turbopack-webpack-config-testing",
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
      "id": "next-lab-turbopack-webpack-config-security",
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
      "id": "next-lab-turbopack-webpack-config-tradeoffs",
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
    "Separate cold and warm measurements. Repeatedly deleting caches can hide the benefit of incremental builds and distort the normal workflow; invalidate deliberately when diagnosing stale outputs."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-turbopack-webpack-config-extension",
      "question": "Should you clear .next before every timing measurement?",
      "expectedConcepts": [
        "Versions and migrations",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Separate cold and warm measurements. Repeatedly deleting caches can hide the benefit of incremental builds and distort the normal workflow; invalidate deliberately when diagnosing stale outputs."
    }
  ]
}
```
