# Reference: Frontend: Toggle password

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep visibility as a boolean independent of the controlled password string. Switch type between password and text, use a button with type=button, and expose a clear Show password or Hide password action. Preserve focus/caret where the browser permits it. Do not duplicate, log, or persist the field merely to implement visibility.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[value,setValue]=useState(''),[show,setShow]=useState(false);return <form onSubmit={e=>e.preventDefault()}><label>Password<input aria-label=\"Password\" type={show?'text':'password'} value={value} onChange={e=>setValue(e.target.value)}/></label><button type=\"button\" onClick={()=>setShow(v=>!v)}>{show?'Hide password':'Show password'}</button></form>;}",
    "architectureNotes": "Follow-up: Support press-and-hold reveal with pointer cancellation while retaining a keyboard-accessible alternative.\nTopic reference: https://namastedev.com/practice/toggle-password\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "toggle-password-correctness",
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
    "Support press-and-hold reveal with pointer cancellation while retaining a keyboard-accessible alternative."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty value; toggling after typing; form does not submit.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "toggle-password-variation",
      "question": "Support press-and-hold reveal with pointer cancellation while retaining a keyboard-accessible alternative.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep visibility as a boolean independent of the controlled password string. Switch type between password and text, use a button with type=button, and expose a clear Show password or Hide password action. Preserve focus/caret where the browser permits it. Do not duplicate, log, or persist the field merely to implement visibility. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
