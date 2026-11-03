# Reference: Frontend: Tooltip

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep the trigger accessible without requiring the tooltip. Use an element with role=tooltip and associate it through aria-describedby. Open on hover or focus, close on Escape and the appropriate pointer/focus exit, and clean up delay timers. A tooltip should not contain interactive controls; use a popover or dialog when users must interact with its content.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[open,setOpen]=useState(false);return <section><button aria-describedby={open?'help-tip':undefined} onFocus={()=>setOpen(true)} onBlur={()=>setOpen(false)} onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} onKeyDown={e=>{if(e.key==='Escape')setOpen(false);}}>Help</button>{open&&<div id=\"help-tip\" role=\"tooltip\">Extra help</div>}</section>;}",
    "architectureNotes": "Follow-up: Position the help near viewport edges without clipping or creating an interactive hover trap.\nTopic reference: https://namastedev.com/practice/tooltip\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "tooltip-correctness",
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
    "Position the help near viewport edges without clipping or creating an interactive hover trap."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Hover; focus; Escape.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "tooltip-variation",
      "question": "Position the help near viewport edges without clipping or creating an interactive hover trap.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep the trigger accessible without requiring the tooltip. Use an element with role=tooltip and associate it through aria-describedby. Open on hover or focus, close on Escape and the appropriate pointer/focus exit, and clean up delay timers. A tooltip should not contain interactive controls; use a popover or dialog when users must interact with its content. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
