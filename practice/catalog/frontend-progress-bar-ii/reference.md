# Reference: Frontend: Progress Bar II

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Model each task as queued, running, completed, failed, or cancelled. Start no more than the allowed active count and release capacity on every terminal path. Derive progress from completed work or elapsed simulation time according to the contract. Keep timers/controllers keyed by task ID and clean them up when tasks disappear.",
    "codeOrArtifact": "import {useState,useRef} from 'react';export default function App(){const[tasks,setTasks]=useState([]),next=useRef(1);function schedule(list){let active=list.filter(t=>t.state==='running').length;return list.map(t=>{if(t.state==='queued'&&active<2){active++;return{...t,state:'running'};}return t;});}return <section><button data-action=\"add\" onClick={()=>{const id=String(next.current++);setTasks(old=>schedule([...old,{id,state:'queued',progress:0}]));}}>Add task</button><button data-action=\"advance\" onClick={()=>setTasks(old=>schedule(old.map(t=>t.state==='running'?{...t,progress:Math.min(100,t.progress+50),state:t.progress+50>=100?'completed':'running'}:t)))}>Advance</button><ul>{tasks.map(t=><li key={t.id} data-task={t.id}>{t.state+':'+t.progress}</li>)}</ul></section>;}",
    "architectureNotes": "Follow-up: Replace simulated time with real byte/work acknowledgements and keep retry progress semantics explicit.\nTopic reference: https://namastedev.com/practice/progress-bar-ii\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "progress-bar-ii-correctness",
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
    "Replace simulated time with real byte/work acknowledgements and keep retry progress semantics explicit."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Capacity limit; completion frees slot; cancellation.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "progress-bar-ii-variation",
      "question": "Replace simulated time with real byte/work acknowledgements and keep retry progress semantics explicit.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Model each task as queued, running, completed, failed, or cancelled. Start no more than the allowed active count and release capacity on every terminal path. Derive progress from completed work or elapsed simulation time according to the contract. Keep timers/controllers keyed by task ID and clean them up when tasks disappear. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
