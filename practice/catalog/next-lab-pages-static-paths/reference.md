# Reference: Choose Pages Router fallback and revalidation explicitly

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Paths use the exact params shape for the dynamic segment, and fallback accepts supported values rather than an arbitrary string. blocking can generate unknown paths on first access; it is not per-request SSR forever, and it is incompatible with a pure static export. Real data lookup must still distinguish nonexistent records.",
    "codeOrArtifact": "// Corrected review reference: pages/posts/[slug].tsx\nimport type { GetStaticPaths,GetStaticProps,InferGetStaticPropsType } from 'next';\nexport const getStaticPaths=(async()=>({paths:[{params:{slug:'intro'}}],fallback:'blocking'})) satisfies GetStaticPaths;\nexport const getStaticProps=(async({params})=>{const slug=typeof params?.slug==='string'?params.slug:'';if(!slug)return {notFound:true};return {props:{slug},revalidate:60};}) satisfies GetStaticProps<{slug:string}>;\nexport default function Page({slug}:InferGetStaticPropsType<typeof getStaticProps>){return <h1>{slug}</h1>;}",
    "architectureNotes": "Verification:\n- Build and directly request the prebuilt intro path.\n- Request a new path and observe subsequent serving behavior.\n- Add a missing-record fixture and verify notFound rather than fabricating a valid post.\n\nThis is a focused review reference, not a complete application/service implementation."
  },
  "rubric": [
    {
      "id": "next-lab-pages-static-paths-correctness",
      "category": "correctness",
      "label": "Behavior and invariant",
      "description": "Paths use the exact params shape for the dynamic segment, and fallback accepts supported values rather than an arbitrary string. blocking can generate unknown paths on first access; it is not per-request SSR forever, and it is incompatible with a pure static export. Real data lookup must still distinguish nonexistent records.",
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
      "id": "next-lab-pages-static-paths-testing",
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
      "id": "next-lab-pages-static-paths-security",
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
      "id": "next-lab-pages-static-paths-tradeoffs",
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
    "Compare generateStaticParams and the chosen rendering/cache model rather than searching for a one-to-one export rename. Unknown-path policy, revalidation and deployment support must be reverified in the destination router."
  ],
  "commonMistakes": [
    "Verifying only next dev when the behavior depends on production rendering or bundling.",
    "Treating a visible UI state, matcher or TypeScript type as a substitute for server-side validation and authorization."
  ],
  "followUps": [
    {
      "id": "next-lab-pages-static-paths-extension",
      "question": "How does this map to the App Router?",
      "expectedConcepts": [
        "Pages Router and migration",
        "Changed assumptions",
        "Runtime evidence"
      ],
      "sampleStrongAnswer": "Compare generateStaticParams and the chosen rendering/cache model rather than searching for a one-to-one export rename. Unknown-path policy, revalidation and deployment support must be reverified in the destination router."
    }
  ]
}
```
