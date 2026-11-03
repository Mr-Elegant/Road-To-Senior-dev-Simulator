# Reference: Frontend: Tabs Component

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Maintain active and focused tab IDs according to a chosen manual or automatic activation model. Use roving tabindex, arrow-key movement, Home/End, aria-selected, and matching tab/panel IDs. Disabled tabs must be skipped consistently. Decide whether inactive panels retain state and ensure hidden panel controls are not reachable.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[index,setIndex]=useState(0),titles=['One','Two'];function choose(i){setIndex(i);document.getElementById('tab-'+i)?.focus();}return <section><div role=\"tablist\" aria-label=\"Sections\">{titles.map((title,i)=><button key={title} role=\"tab\" id={'tab-'+i} aria-controls={'panel-'+i} aria-selected={index===i} tabIndex={index===i?0:-1} onClick={()=>choose(i)} onKeyDown={e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();choose(e.key==='Home'?0:e.key==='End'?1:(i+(e.key==='ArrowRight'?1:-1)+2)%2);}}}>{title}</button>)}</div><div role=\"tabpanel\" id={'panel-'+index} aria-labelledby={'tab-'+index}>{index===0?'First':'Second'}</div></section>;}",
    "architectureNotes": "Follow-up: Support vertical orientation and dynamic tab removal while preserving an understandable focus target.\nTopic reference: https://namastedev.com/practice/tabs-component\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "tabs-component-correctness",
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
    "Support vertical orientation and dynamic tab removal while preserving an understandable focus target."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Arrow wrapping; Home/End; disabled tab.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "tabs-component-variation",
      "question": "Support vertical orientation and dynamic tab removal while preserving an understandable focus target.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Maintain active and focused tab IDs according to a chosen manual or automatic activation model. Use roving tabindex, arrow-key movement, Home/End, aria-selected, and matching tab/panel IDs. Disabled tabs must be skipped consistently. Decide whether inactive panels retain state and ensure hidden panel controls are not reachable. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
