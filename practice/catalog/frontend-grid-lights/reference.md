# Reference: Frontend: Grid Lights

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Represent active cells by stable coordinates or IDs and derive the count. Use native buttons with accessible names and pressed states instead of unlabeled colored squares. Toggle with an immutable set update. If cells have dependencies, encode that rule separately rather than mutating the DOM directly.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[order,setOrder]=useState([]),[phase,setPhase]=useState('ready'),replay=false;function toggle(id){if(phase==='replay')return;setOrder(old=>{if(old.includes(id))return replay?old:old.filter(v=>v!==id);const next=[...old,id];if(replay&&next.length===4)setPhase('replay');return next;});}return <section><div role=\"group\" aria-label=\"Lights\">{[0,1,2,3].map(id=><button key={id} data-cell={id} aria-pressed={order.includes(id)} disabled={phase==='replay'} onClick={()=>toggle(id)}>{id}</button>)}</div><output data-testid=\"count\">{order.length}</output><output data-testid=\"phase\">{phase}</output>{replay&&<button data-action=\"step\" onClick={()=>{if(phase!=='replay')return;setOrder(old=>{const next=old.slice(0,-1);if(!next.length)setPhase('ready');return next;});}}>Step</button>}</section>;}",
    "architectureNotes": "Follow-up: Add a neighborhood-toggle puzzle and specify whether invalid cells or repeated events are ignored.\nTopic reference: https://namastedev.com/practice/grid-lights\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "grid-lights-correctness",
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
    "Add a neighborhood-toggle puzzle and specify whether invalid cells or repeated events are ignored."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Toggle twice; all on/off; changing grid dimensions.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "grid-lights-variation",
      "question": "Add a neighborhood-toggle puzzle and specify whether invalid cells or repeated events are ignored.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Represent active cells by stable coordinates or IDs and derive the count. Use native buttons with accessible names and pressed states instead of unlabeled colored squares. Toggle with an immutable set update. If cells have dependencies, encode that rule separately rather than mutating the DOM directly. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
