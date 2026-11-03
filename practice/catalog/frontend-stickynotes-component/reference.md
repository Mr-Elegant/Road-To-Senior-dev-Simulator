# Reference: Frontend: StickyNotes Component

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store stable note IDs, content, and logical positions. During pointer movement update presentation efficiently and commit a bounded position on release. Keep editing gestures separate from dragging, and define a z-order policy. Persist a versioned schema and recover corrupt storage. Provide a keyboard position alternative and account for container resize rather than restoring offscreen pixel coordinates blindly.",
    "codeOrArtifact": "import {useState,useRef} from 'react';export default function App(){const[notes,setNotes]=useState([]),next=useRef(1);return <section><button data-action=\"add\" onClick={()=>{const id=String(next.current++);setNotes(old=>[...old,{id,text:'',x:20}]);}}>Add note</button><div>{notes.map(note=><article key={note.id} data-note={note.id} data-x={note.x} style={{transform:'translateX('+note.x+'px)',maxWidth:'180px'}}><label>Note {note.id}<textarea aria-label={'Note '+note.id} value={note.text} onChange={e=>setNotes(old=>old.map(n=>n.id===note.id?{...n,text:e.target.value}:n))}/></label><button data-move={note.id} onClick={()=>setNotes(old=>old.map(n=>n.id===note.id?{...n,x:Math.min(200,n.x+10)}:n))}>Move right</button><button data-delete={note.id} onClick={()=>setNotes(old=>old.filter(n=>n.id!==note.id))}>Delete</button></article>)}</div></section>;}",
    "architectureNotes": "Follow-up: Add shared-board synchronization with explicit conflict resolution for concurrent text and position edits.\nTopic reference: https://namastedev.com/practice/stickynotes-component\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "stickynotes-component-correctness",
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
    "Add shared-board synchronization with explicit conflict resolution for concurrent text and position edits."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Drag vs edit; pointer cancel; deleting active note.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "stickynotes-component-variation",
      "question": "Add shared-board synchronization with explicit conflict resolution for concurrent text and position edits.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store stable note IDs, content, and logical positions. During pointer movement update presentation efficiently and commit a bounded position on release. Keep editing gestures separate from dragging, and define a z-order policy. Persist a versioned schema and recover corrupt storage. Provide a keyboard position alternative and account for container resize rather than restoring offscreen pixel coordinates blindly. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
