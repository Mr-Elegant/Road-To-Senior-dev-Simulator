# Reference: Frontend: Product Rating Heatmap

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Normalize counts using a documented global or per-row scale, since the choice changes interpretation. Validate numeric values and distinguish missing from zero. Render row/column labels and text alternatives so color is not the only information channel. Memoize expensive aggregation only after measuring; the displayed color should be derived from counts.",
    "codeOrArtifact": "export default function App({values=[[0,2],[4,1]]}){const max=Math.max(0,...values.flat().filter(v=>v!==null));return <table><caption>Ratings</caption><tbody>{values.map((row,r)=><tr key={r}>{row.map((v,c)=><td key={c} data-cell={r+','+c} data-level={v===null?'missing':max?Math.floor(v/max*4):0}>{v===null?'-':v}</td>)}</tr>)}</tbody></table>;}",
    "architectureNotes": "Follow-up: Switch between absolute and relative scales and explain how each can mislead comparisons.\nTopic reference: https://namastedev.com/practice/product-rating-heatmap\nThis app contract and reference were independently authored."
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
