# Reference: Frontend: Modal In React

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Centralize modal open state and use a native dialog or a proven accessible primitive. The title provides its accessible name, background content must be inert for modal behavior, and focus must remain within the active dialog. Restore focus after close. A portal changes DOM placement, not the responsibility to handle accessibility and cleanup.",
    "codeOrArtifact": "import {useRef,useState} from 'react';export default function App(){const dialog=useRef(null),trigger=useRef(null),[closed,setClosed]=useState(0);function close(){if(!dialog.current.open)return;dialog.current.close();setClosed(n=>n+1);trigger.current.focus();}return <section><button data-action=\"open\" ref={trigger} onClick={()=>dialog.current.showModal()}>Open details</button><dialog ref={dialog} aria-labelledby=\"details-title\" onCancel={e=>{e.preventDefault();close();}} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();close();}}}><h2 id=\"details-title\">Details</h2><button data-action=\"close\" onClick={close}>Close details</button></dialog><output data-testid=\"closed\">{closed}</output></section>;}",
    "architectureNotes": "Follow-up: Handle stacked dialogs with explicit ownership rather than independent global key handlers.\nTopic reference: https://namastedev.com/practice/modal-in-react\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "modal-in-react-correctness",
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
    "Handle stacked dialogs with explicit ownership rather than independent global key handlers."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Escape; backdrop policy; initial focus.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "modal-in-react-variation",
      "question": "Handle stacked dialogs with explicit ownership rather than independent global key handlers.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Centralize modal open state and use a native dialog or a proven accessible primitive. The title provides its accessible name, background content must be inert for modal behavior, and focus must remain within the active dialog. Restore focus after close. A portal changes DOM placement, not the responsibility to handle accessibility and cleanup. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
