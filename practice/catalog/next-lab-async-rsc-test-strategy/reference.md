# Reference: Choose a real-server test for async Server Component behavior

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A pure unit test is valuable for policy logic but cannot establish the framework’s async rendering, route conventions, response headers or caching. Use production-server integration/E2E tests for those boundaries and keep deterministic data fixtures. Add direct and soft-navigation cases because their behavior can differ.",
    "codeOrArtifact": "// Corrected review reference: tests/product.spec.ts\nimport { test,expect } from '@playwright/test';\ntest('product route supports direct navigation',async({page})=>{const response=await page.goto('/products/one');expect(response?.status()).toBe(200);await expect(page.getByRole('heading',{name:'Product one'})).toBeVisible();});\n// Run against next build + next start with a controlled data fixture, not a mocked Next transport.",
    "architectureNotes": "Verification:\n- Run the test against a production build.\n- Add missing-resource, failure and soft-navigation journeys.\n- Use an origin counter or controlled clock for cache claims rather than inferring them from a visible heading.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-async-rsc-test-strategy-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "A pure unit test is valuable for policy logic but cannot establish the framework’s async rendering, route conventions, response headers or caching. Use production-server integration/E2E tests for those boundaries and keep deterministic data fixtures. Add direct and soft-navigation cases because their behavior can differ.",
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
      "id": "next-lab-async-rsc-test-strategy-testing",
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
      "id": "next-lab-async-rsc-test-strategy-security",
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
      "id": "next-lab-async-rsc-test-strategy-tradeoffs",
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
    "No. Test pure transformations and authorization matrices cheaply at unit level, then cover the small number of real framework and deployment boundaries with integration/E2E evidence. Mocks and real-server evidence answer different questions."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-async-rsc-test-strategy-extension",
      "question": "Should every policy use a browser test?",
      "expectedConcepts": [
        "Testing and operations",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "No. Test pure transformations and authorization matrices cheaply at unit level, then cover the small number of real framework and deployment boundaries with integration/E2E evidence. Mocks and real-server evidence answer different questions."
    }
  ]
}
```
