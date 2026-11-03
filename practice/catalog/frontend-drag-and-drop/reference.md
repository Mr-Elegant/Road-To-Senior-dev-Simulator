# Reference: Frontend: Drag and Drop

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Separate the dragged item ID and hover target from the committed order. On drop compute one immutable reorder and clear transient state; on cancellation restore the original arrangement. Use stable keys and ensure event listeners or pointer capture are released. Provide move buttons or a complete keyboard drag model instead of assuming pointer input.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({items=['A','B','C']}){const[order,setOrder]=useState(items),[dragged,setDragged]=useState(null);function move(from,to){setOrder(old=>{const a=old.indexOf(from),b=old.indexOf(to);if(a<0||b<0||a===b)return old;const next=[...old];next.splice(a,1);next.splice(b,0,from);return next;});}return <section><ul>{order.map((id,i)=><li key={id} data-id={id} draggable onDragStart={()=>setDragged(id)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();move(dragged,id);setDragged(null);}}>{id}<button data-down={id} onClick={()=>{if(i<order.length-1)move(id,order[i+1]);}}>Move down {id}</button></li>)}</ul><output data-testid=\"order\">{order.join(',')}</output></section>;}",
    "architectureNotes": "Follow-up: Announce drag start, destination, and completion through a restrained live region.\nTopic reference: https://namastedev.com/practice/drag-and-drop\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "drag-and-drop-correctness",
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
    "Announce drag start, destination, and completion through a restrained live region."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Cancelled drag; drop outside; adjacent move.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "drag-and-drop-variation",
      "question": "Announce drag start, destination, and completion through a restrained live region.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Separate the dragged item ID and hover target from the committed order. On drop compute one immutable reorder and clear transient state; on cancellation restore the original arrangement. Use stable keys and ensure event listeners or pointer capture are released. Provide move buttons or a complete keyboard drag model instead of assuming pointer input. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
