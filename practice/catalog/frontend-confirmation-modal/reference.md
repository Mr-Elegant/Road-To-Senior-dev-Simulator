# Reference: Frontend: Confirmation Modal

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep pending intent separate from the confirmed action. Prefer a native dialog opened with showModal so background content becomes inert. Provide a title, clear confirm/cancel names, Escape cancellation, and deliberate initial focus. Commit the action only on confirmation and restore focus to the original trigger after closing.",
    "codeOrArtifact": "import {useRef,useState} from 'react';export default function App(){const dialog=useRef(null),trigger=useRef(null),[deleted,setDeleted]=useState(0);function close(){dialog.current.close();trigger.current.focus();}return <section><button data-action=\"delete\" ref={trigger} onClick={()=>dialog.current.showModal()}>Delete</button><output data-testid=\"deleted\">{deleted}</output><dialog ref={dialog} aria-labelledby=\"confirm-title\" onCancel={e=>{e.preventDefault();close();}} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();close();}}}><h2 id=\"confirm-title\">Confirm deletion</h2><button data-action=\"confirm\" onClick={()=>{setDeleted(n=>n+1);close();}}>Confirm</button><button data-action=\"cancel\" onClick={close}>Cancel</button></dialog></section>;}",
    "architectureNotes": "Follow-up: Represent asynchronous confirmation with a pending state and prevent accidental duplicate execution.\nTopic reference: https://namastedev.com/practice/confirmation-modal\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "confirmation-modal-correctness",
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
    "Represent asynchronous confirmation with a pending state and prevent accidental duplicate execution."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Cancel; Escape; confirm exactly once.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "confirmation-modal-variation",
      "question": "Represent asynchronous confirmation with a pending state and prevent accidental duplicate execution.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep pending intent separate from the confirmed action. Prefer a native dialog opened with showModal so background content becomes inert. Provide a title, clear confirm/cancel names, Escape cancellation, and deliberate initial focus. Commit the action only on confirmation and restore focus to the original trigger after closing. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
