# Reference: React + TypeScript: Product Rating Heatmap

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Normalize counts using a documented global or per-row scale, since the choice changes interpretation. Validate numeric values and distinguish missing from zero. Render row/column labels and text alternatives so color is not the only information channel. Memoize expensive aggregation only after measuring; the displayed color should be derived from counts.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    values?: ((number | null)[])[];\n}\nexport default function App({ values = [[0, 2], [4, 1]] }: AppProps = {}): React.JSX.Element { const max = Math.max(0, ...values.flat().filter(v => v !== null)); return <table><caption>Ratings</caption><tbody>{values.map((row, r) => <tr key={r}>{row.map((v, c) => <td key={c} data-cell={r + ',' + c} data-level={v === null ? 'missing' : max ? Math.floor(v / max * 4) : 0}>{v === null ? '-' : v}</td>)}</tr>)}</tbody></table>; }\n",
    "architectureNotes": "Follow-up: Switch between absolute and relative scales and explain how each can mislead comparisons.\nTopic reference: https://namastedev.com/practice/product-rating-heatmap\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-product-rating-heatmap. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "product-rating-heatmap-correctness",
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
    "Switch between absolute and relative scales and explain how each can mislead comparisons."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: All zeros; one extreme value; missing cells.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "product-rating-heatmap-variation",
      "question": "Switch between absolute and relative scales and explain how each can mislead comparisons.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Normalize counts using a documented global or per-row scale, since the choice changes interpretation. Validate numeric values and distinguish missing from zero. Render row/column labels and text alternatives so color is not the only information channel. Memoize expensive aggregation only after measuring; the displayed color should be derived from counts. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
