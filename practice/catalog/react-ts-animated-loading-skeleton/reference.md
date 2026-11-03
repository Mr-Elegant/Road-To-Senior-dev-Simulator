# Reference: React + TypeScript: Animated Loading Skeleton

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep loading state explicit and reserve approximately the final layout dimensions to reduce shifts. Mark the affected region busy and keep decorative skeleton shapes hidden from assistive technology. Stop looping motion under reduced motion and replace loading with error or empty states when appropriate; an endless shimmer must not hide a failed request.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    state?: string;\n    content?: string;\n}\nexport default function App({ state = 'loading', content = 'Ready' }: AppProps = {}): React.JSX.Element { return <section aria-label=\"Results\" aria-busy={state === 'loading'}>{state === 'loading' ? <div data-testid=\"skeleton\" aria-hidden=\"true\" style={{ height: 40, background: '#d4d4d8' }}/> : state === 'error' ? <p role=\"alert\">Unable to load</p> : state === 'empty' ? <p>No results</p> : <p>{content}</p>}</section>; }\n",
    "architectureNotes": "Follow-up: Coordinate several regions so partial data can render without resetting already usable sections.\nTopic reference: https://namastedev.com/practice/animated-loading-skeleton\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-animated-loading-skeleton. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "animated-loading-skeleton-correctness",
      "category": "correctness",
      "label": "Observable behavior and reasoning",
      "weight": 5,
      "description": "Use the executable cases as behavioral evidence; explain invariant, validation, complexity, and limits.",
      "levels": [
        {
          "score": 0,
          "description": "The main behavior does not work."
        },
        {
          "score": 1,
          "description": "Only a happy path works."
        },
        {
          "score": 2,
          "description": "Authored cases pass but the reasoning is incomplete."
        },
        {
          "score": 3,
          "description": "Authored cases pass and the invariant, boundaries, and trade-offs are explained."
        }
      ]
    }
  ],
  "alternatives": [
    "Coordinate several regions so partial data can render without resetting already usable sections."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Loading to success; failure; empty response.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "animated-loading-skeleton-variation",
      "question": "Coordinate several regions so partial data can render without resetting already usable sections.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep loading state explicit and reserve approximately the final layout dimensions to reduce shifts. Mark the affected region busy and keep decorative skeleton shapes hidden from assistive technology. Stop looping motion under reduced motion and replace loading with error or empty states when appropriate; an endless shimmer must not hide a failed request. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
