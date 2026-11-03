# Reference: Frontend: usePreviousHook

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use a ref to retain the prior value and update it in an effect after commit. During rendering return the existing ref value, which is undefined on the initial render. Do not assign the ref while rendering to pretend the current value is previous. Decide whether equality-based suppression belongs in a separate abstraction.",
    "codeOrArtifact": "import {useState,useRef,useEffect} from 'react';function usePrevious(value){const ref=useRef();useEffect(()=>{ref.current=value;},[value]);return ref.current;}export default function App({initial=0}){const[n,setN]=useState(initial),previous=usePrevious(n);return <section><output data-testid=\"current\">{n}</output><output data-testid=\"previous\">{previous===undefined?'none':previous}</output><button onClick={()=>setN(v=>v+1)}>Increment</button></section>;}",
    "architectureNotes": "Follow-up: Implement previous-distinct-value semantics and explain how it differs from previous-render semantics.\nTopic reference: https://namastedev.com/practice/useprevioushook\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "useprevioushook-correctness",
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
    "Implement previous-distinct-value semantics and explain how it differs from previous-render semantics."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: First render; changed value; unchanged value.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "useprevioushook-variation",
      "question": "Implement previous-distinct-value semantics and explain how it differs from previous-render semantics.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use a ref to retain the prior value and update it in an effect after commit. During rendering return the existing ref value, which is undefined on the initial render. Do not assign the ref while rendering to pretend the current value is previous. Decide whether equality-based suppression belongs in a separate abstraction. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
