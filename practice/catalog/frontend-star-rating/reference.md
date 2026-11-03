# Reference: Frontend: Star Rating

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store the committed rating and transient preview independently. Render a radiogroup or an equivalent fully implemented interaction pattern, not decorative clickable icons alone. Pointer exit restores the committed view. Arrow keys should move through valid options and accessible labels must identify values. Decide whether zero/unrated is allowed.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({initial=0,readOnly=false}){const[value,setValue]=useState(initial);return <section><div role=\"radiogroup\" aria-label=\"Rating\">{[1,2,3,4,5].map(n=><button key={n} data-rating={n} role=\"radio\" aria-label={n+' stars'} aria-checked={value===n} onClick={()=>{if(!readOnly)setValue(n);}} onKeyDown={e=>{if(!readOnly&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();setValue(v=>Math.max(1,Math.min(5,v+(e.key==='ArrowRight'?1:-1))));}}}>★</button>)}</div><output data-testid=\"rating\">{value}</output></section>;}",
    "architectureNotes": "Follow-up: Support fractional display without pretending half-star selection follows automatically from integer radios.\nTopic reference: https://namastedev.com/practice/star-rating\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "star-rating-correctness",
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
    "Support fractional display without pretending half-star selection follows automatically from integer radios."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Unrated; hover without commit; pointer leave.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "star-rating-variation",
      "question": "Support fractional display without pretending half-star selection follows automatically from integer radios.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store the committed rating and transient preview independently. Render a radiogroup or an equivalent fully implemented interaction pattern, not decorative clickable icons alone. Pointer exit restores the committed view. Arrow keys should move through valid options and accessible labels must identify values. Decide whether zero/unrated is allowed. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
