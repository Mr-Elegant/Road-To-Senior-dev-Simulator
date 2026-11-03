# Reference: Frontend: Price Range Slider

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep one valid range and normalize each change against bounds and the other endpoint. For native range controls provide distinct names and visible values. Mirror number fields carefully: an incomplete numeric draft is not automatically a valid committed endpoint. Keep filtering derived from the normalized range and document inclusive boundaries.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[min,setMin]=useState(0),[max,setMax]=useState(100);return <section><label>Minimum<input name=\"min\" aria-label=\"Minimum\" type=\"range\" min=\"0\" max=\"100\" value={min} onChange={e=>setMin(Math.min(max,Number(e.target.value)))}/></label><label>Maximum<input name=\"max\" aria-label=\"Maximum\" type=\"range\" min=\"0\" max=\"100\" value={max} onChange={e=>setMax(Math.max(min,Number(e.target.value)))}/></label><output data-testid=\"range\">{min+'-'+max}</output></section>;}",
    "architectureNotes": "Follow-up: Support currency-specific step sizes without floating-point drift in accepted prices.\nTopic reference: https://namastedev.com/practice/price-range-slider\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "price-range-slider-correctness",
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
    "Support currency-specific step sizes without floating-point drift in accepted prices."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Equal endpoints; min above max; keyboard arrows.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "price-range-slider-variation",
      "question": "Support currency-specific step sizes without floating-point drift in accepted prices.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep one valid range and normalize each change against bounds and the other endpoint. For native range controls provide distinct names and visible values. Mirror number fields carefully: an incomplete numeric draft is not automatically a valid committed endpoint. Keep filtering derived from the normalized range and document inclusive boundaries. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
