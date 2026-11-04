# Reference: Audit Next.js 15-to-16 migration blockers

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Inventory migration blockers before running codemods so review and rollback have a finite target. A codemod is a change tool, not evidence that caching, authorization or routing behavior remained correct. Keep the installed patch and official upgrade guide in the migration record.",
    "codeOrArtifact": "function solution(x){return [['syncRequestApis','async-request-apis'],['middlewareFile','proxy-rename'],['webpackOnlyConfig','bundler-review'],['nextLintScript','eslint-cli']].filter(([key])=>x[key]===true).map(([,code])=>code);}",
    "architectureNotes": "Pure application-policy model. Integrate and verify against the real server separately."
  },
  "rubric": [
    {
      "id": "next-lab-migration-audit-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Input {syncRequestApis,middlewareFile,webpackOnlyConfig,nextLintScript}; values are booleans. Return ordered blocker codes: async-request-apis, proxy-rename, bundler-review, eslint-cli for each true flag. Empty input has no blockers. This is an explicit input audit, not source-code analysis.",
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
      "id": "next-lab-migration-audit-testing",
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
      "id": "next-lab-migration-audit-security",
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
      "id": "next-lab-migration-audit-tradeoffs",
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
    "Separate compatibility cleanup on 15 from switching the major and bundler. Establish baseline routes and performance budgets, migrate in small commits and keep a verified previous deployment available for rollback."
  ],
  "commonMistakes": [
    "Treating a passing model as proof of framework or distributed-system behavior.",
    "Silently coercing values outside the explicitly allowed input policy."
  ],
  "followUps": [
    {
      "id": "next-lab-migration-audit-extension",
      "question": "Would you fix every blocker in one release?",
      "expectedConcepts": [
        "Changed contract",
        "Boundary evidence",
        "Server ownership"
      ],
      "sampleStrongAnswer": "Separate compatibility cleanup on 15 from switching the major and bundler. Establish baseline routes and performance budgets, migrate in small commits and keep a verified previous deployment available for rollback."
    }
  ]
}
```
