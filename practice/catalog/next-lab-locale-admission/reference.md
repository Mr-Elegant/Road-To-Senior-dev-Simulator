# Reference: Admit a locale before loading a server dictionary

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "An admitted locale selects a known loader instead of constructing an arbitrary module path from a route parameter. Await the route prop, handle unsupported locales and keep dictionaries on the server when only rendered text is needed. Domain redirects, cookie preferences and cache keys need a consistent locale policy.",
    "codeOrArtifact": "// Corrected review reference: app/[lang]/page.tsx\nimport { notFound } from 'next/navigation';\nconst dictionaries={en:async()=>({title:'Welcome'}),hi:async()=>({title:'Namaste'})};\nexport default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(lang!=='en'&&lang!=='hi')notFound();const dictionary=await dictionaries[lang]();return <h1>{dictionary.title}</h1>;}",
    "architectureNotes": "Verification:\n- Request en, hi and an unsupported locale.\n- Verify the browser does not download every complete dictionary unnecessarily.\n- Test canonical/hreflang metadata and any locale redirect loop policy in a real deployment.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-locale-admission-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "An admitted locale selects a known loader instead of constructing an arbitrary module path from a route parameter. Await the route prop, handle unsupported locales and keep dictionaries on the server when only rendered text is needed. Domain redirects, cookie preferences and cache keys need a consistent locale policy.",
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
      "id": "next-lab-locale-admission-testing",
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
      "id": "next-lab-locale-admission-security",
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
      "id": "next-lab-locale-admission-tradeoffs",
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
    "No. Language negotiation is a representation preference, not identity or domain ownership. Keep trusted tenant/domain resolution separate and include admitted locale in any shared representation key."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-locale-admission-extension",
      "question": "Would reading Accept-Language authorize a tenant domain?",
      "expectedConcepts": [
        "Routing and URL state",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "No. Language negotiation is a representation preference, not identity or domain ownership. Keep trusted tenant/domain resolution separate and include admitted locale in any shared representation key."
    }
  ]
}
```
