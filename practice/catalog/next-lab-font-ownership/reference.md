# Reference: Load a font once in the root layout

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "next/font keeps font ownership near the layout and avoids repeated runtime stylesheet insertion. A local file makes the build input explicit and can avoid remote build-time fetching. The lab must supply the licensed font asset; the source snippet does not pretend to include binary font content.",
    "codeOrArtifact": "// Corrected review reference: app/layout.tsx\nimport localFont from 'next/font/local';\nconst ui=localFont({src:'./fonts/ui.woff2',display:'swap',variable:'--font-ui'});\nexport default function Layout({children}:{children:React.ReactNode}){return <html lang=\"en\"><body className={ui.className}>{children}</body></html>;}\n// Supply a licensed ui.woff2 at app/fonts/ui.woff2 in this lab.",
    "architectureNotes": "Verification:\n- Provide the local font and build offline.\n- Verify pages share the same generated font styling.\n- Check fallback readability and layout shift while the font loads.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-font-ownership-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "next/font keeps font ownership near the layout and avoids repeated runtime stylesheet insertion. A local file makes the build input explicit and can avoid remote build-time fetching. The lab must supply the licensed font asset; the source snippet does not pretend to include binary font content.",
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
      "id": "next-lab-font-ownership-testing",
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
      "id": "next-lab-font-ownership-security",
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
      "id": "next-lab-font-ownership-tradeoffs",
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
    "Font optimization can need network access during the build. Make that dependency explicit, permit the required fetch or use a licensed local asset; do not fix it by quietly disabling all optimization or hiding build failures."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-font-ownership-extension",
      "question": "Why might a CI build fail with a Google font?",
      "expectedConcepts": [
        "Metadata and assets",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Font optimization can need network access during the build. Make that dependency explicit, permit the required fetch or use a licensed local asset; do not fix it by quietly disabling all optimization or hiding build failures."
    }
  ]
}
```
