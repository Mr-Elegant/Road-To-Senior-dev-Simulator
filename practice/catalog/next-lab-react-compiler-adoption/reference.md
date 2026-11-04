# Reference: Adopt React Compiler with dependency and purity checks

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Configuration, compiler dependency and component correctness are separate prerequisites. The React Compiler can reduce manual memoization needs but does not turn mutation during render into a valid pattern or guarantee a faster application. Keep the adoption behind measured interaction/build regression evidence.",
    "codeOrArtifact": "// Corrected review reference: next.config.ts\nimport type { NextConfig } from 'next';\nconst config:NextConfig={reactCompiler:true};export default config;\n// Install the version-compatible babel-plugin-react-compiler dev dependency in the lab.\n// Fix render purity/hook-rule violations and compare interactions/build cost before enabling broadly.",
    "architectureNotes": "Verification:\n- Install the matching plugin in an isolated lab and build.\n- Test representative pure/impure component fixtures and hook-rule diagnostics.\n- Compare actual render interactions and cold/warm build cost before and after.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-react-compiler-adoption-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Configuration, compiler dependency and component correctness are separate prerequisites. The React Compiler can reduce manual memoization needs but does not turn mutation during render into a valid pattern or guarantee a faster application. Keep the adoption behind measured interaction/build regression evidence.",
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
      "id": "next-lab-react-compiler-adoption-testing",
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
      "id": "next-lab-react-compiler-adoption-security",
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
      "id": "next-lab-react-compiler-adoption-tradeoffs",
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
    "No. Review correctness and integration constraints separately from optimization. Adopt incrementally with profiling and tests; unnecessary memoization can be simplified later without combining every change into the compiler rollout."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-react-compiler-adoption-extension",
      "question": "Should you remove every useMemo immediately?",
      "expectedConcepts": [
        "Navigation and performance",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "No. Review correctness and integration constraints separately from optimization. Adopt incrementally with profiling and tests; unnecessary memoization can be simplified later without combining every change into the compiler rollout."
    }
  ]
}
```
