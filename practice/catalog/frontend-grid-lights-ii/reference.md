# Reference: Frontend: Grid Lights II

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep activated cell IDs and an explicit replay state. Reject duplicate activation and ignore user changes while replay is active unless interruption is a documented feature. Own one timer sequence with cleanup and advance through recorded order deterministically. Do not schedule independent closures that all capture an outdated array.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[order,setOrder]=useState([]),[phase,setPhase]=useState('ready'),replay=true;function toggle(id){if(phase==='replay')return;setOrder(old=>{if(old.includes(id))return replay?old:old.filter(v=>v!==id);const next=[...old,id];if(replay&&next.length===4)setPhase('replay');return next;});}return <section><div role=\"group\" aria-label=\"Lights\">{[0,1,2,3].map(id=><button key={id} data-cell={id} aria-pressed={order.includes(id)} disabled={phase==='replay'} onClick={()=>toggle(id)}>{id}</button>)}</div><output data-testid=\"count\">{order.length}</output><output data-testid=\"phase\">{phase}</output>{replay&&<button data-action=\"step\" onClick={()=>{if(phase!=='replay')return;setOrder(old=>{const next=old.slice(0,-1);if(!next.length)setPhase('ready');return next;});}}>Step</button>}</section>;}",
    "architectureNotes": "Follow-up: Support pause/resume and reverse replay using a single reducer-defined state machine.\nTopic reference: https://namastedev.com/practice/grid-lights-ii\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "grid-lights-ii-correctness",
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
    "Support pause/resume and reverse replay using a single reducer-defined state machine."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Duplicate cell; full activation; replay order.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "grid-lights-ii-variation",
      "question": "Support pause/resume and reverse replay using a single reducer-defined state machine.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep activated cell IDs and an explicit replay state. Reject duplicate activation and ignore user changes while replay is active unless interruption is a documented feature. Own one timer sequence with cleanup and advance through recorded order deterministically. Do not schedule independent closures that all capture an outdated array. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
