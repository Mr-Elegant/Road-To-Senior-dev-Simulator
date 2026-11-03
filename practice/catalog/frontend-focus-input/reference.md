# Reference: Frontend: Focus Input

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep a DOM ref with useRef, attach it to the input, and call focus in the event handler. Refs store imperative handles without triggering rendering. Guard against an absent or disabled input, and do not steal focus automatically after every render. If autofocus is a requirement, perform it at a deliberate lifecycle boundary.",
    "codeOrArtifact": "import {useRef,useState} from 'react';export default function App(){const ref=useRef(null),[focused,setFocused]=useState(false);return <section><label>Message<input aria-label=\"Message\" ref={ref} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/></label><button onClick={()=>ref.current?.focus()}>Focus message</button><output data-testid=\"focused\">{focused?'yes':'no'}</output></section>;}",
    "architectureNotes": "Follow-up: Focus the first invalid input after form submission without fighting a user’s current typing position.\nTopic reference: https://namastedev.com/practice/focus-input\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "focus-input-correctness",
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
    "Focus the first invalid input after form submission without fighting a user’s current typing position."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Focus button activation; input absent; disabled input.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "focus-input-variation",
      "question": "Focus the first invalid input after form submission without fighting a user’s current typing position.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep a DOM ref with useRef, attach it to the input, and call focus in the event handler. Refs store imperative handles without triggering rendering. Guard against an absent or disabled input, and do not steal focus automatically after every render. If autofocus is a requirement, perform it at a deliberate lifecycle boundary. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
