# Reference: Frontend: Sortable List

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Represent order as IDs or immutable records and compute a new array for each move. Keep dragged position transient until commitment, and use pointer capture or a mature drag abstraction when needed. Render focusable alternative controls and restore focus to the moved item. Do not use array positions as keys while reordering stateful rows.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({items=['A','B','C']}){const[order,setOrder]=useState(items),[dragged,setDragged]=useState(null);function move(from,to){setOrder(old=>{const a=old.indexOf(from),b=old.indexOf(to);if(a<0||b<0||a===b)return old;const next=[...old];next.splice(a,1);next.splice(b,0,from);return next;});}return <section><ul>{order.map((id,i)=><li key={id} data-id={id} draggable onDragStart={()=>setDragged(id)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();move(dragged,id);setDragged(null);}}>{id}<button data-down={id} onClick={()=>{if(i<order.length-1)move(id,order[i+1]);}}>Move down {id}</button></li>)}</ul><output data-testid=\"order\">{order.join(',')}</output></section>;}",
    "architectureNotes": "Follow-up: Virtualize a large list while keeping keyboard announcements and drag hit targets consistent.\nTopic reference: https://namastedev.com/practice/sortable-list\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "sortable-list-correctness",
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
    "Virtualize a large list while keeping keyboard announcements and drag hit targets consistent."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: First/last item; cancelled move; repeated reorder.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "sortable-list-variation",
      "question": "Virtualize a large list while keeping keyboard announcements and drag hit targets consistent.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Represent order as IDs or immutable records and compute a new array for each move. Keep dragged position transient until commitment, and use pointer capture or a mature drag abstraction when needed. Render focusable alternative controls and restore focus to the moved item. Do not use array positions as keys while reordering stateful rows. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
