# Reference: Frontend: Notification Bell

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep notification identity and read state in records and derive unread count. Opening the panel and marking read are separate product choices; define them explicitly. Use a disclosure button with an accessible name that includes unread context, and preserve keyboard access inside the panel. Apply server events by stable IDs to avoid duplicated unread entries.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({items=[{id:'a',text:'Hello',read:false},{id:'b',text:'Update',read:false}]}){const[records,setRecords]=useState(items),[open,setOpen]=useState(false);return <section><button data-action=\"bell\" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>Bell</button><output data-testid=\"unread\">{records.filter(n=>!n.read).length}</output>{open&&<ul>{records.map(n=><li key={n.id}>{n.text}<button data-read={n.id} disabled={n.read} onClick={()=>setRecords(old=>old.map(item=>item.id===n.id?{...item,read:true}:item))}>Mark read</button></li>)}</ul>}</section>;}",
    "architectureNotes": "Follow-up: Add server acknowledgements so delayed read updates cannot resurrect old unread states.\nTopic reference: https://namastedev.com/practice/notification-bell\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "notification-bell-correctness",
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
    "Add server acknowledgements so delayed read updates cannot resurrect old unread states."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty panel; duplicate event; mark twice.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "notification-bell-variation",
      "question": "Add server acknowledgements so delayed read updates cannot resurrect old unread states.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep notification identity and read state in records and derive unread count. Opening the panel and marking read are separate product choices; define them explicitly. Use a disclosure button with an accessible name that includes unread context, and preserve keyboard access inside the panel. Apply server events by stable IDs to avoid duplicated unread entries. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
