# Reference: Frontend: Todo List

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep an array of task records and update it immutably. Trim titles before insertion and reject blanks. Generate IDs at creation, not during rendering, so editing or reordering does not attach state to a different row. Derive completed totals from records rather than synchronizing another counter. Specify whether deleting a task is immediately permanent or undoable.",
    "codeOrArtifact": "import {useState,useRef} from 'react';export default function App(){const[items,setItems]=useState([]),[draft,setDraft]=useState(''),[filter,setFilter]=useState('all'),[editing,setEditing]=useState(null),[edit,setEdit]=useState(''),next=useRef(1);const advanced=false;function add(){if(!draft.trim())return;const id=String(next.current++);setItems(old=>[...old,{id,title:draft.trim(),done:false}]);setDraft('');}return <section><label>New task<input name=\"draft\" aria-label=\"New task\" value={draft} onChange={e=>setDraft(e.target.value)}/></label><button data-action=\"add\" onClick={add}>Add</button>{advanced&&<label>Filter<select aria-label=\"Filter\" value={filter} onChange={e=>setFilter(e.target.value)}><option value=\"all\">All</option><option value=\"active\">Active</option><option value=\"done\">Done</option></select></label>}<ul>{items.filter(item=>filter==='all'||(filter==='done'?item.done:!item.done)).map(item=><li key={item.id} data-id={item.id} data-done={item.done}><span data-title>{item.title}</span><button data-toggle={item.id} aria-pressed={item.done} onClick={()=>setItems(old=>old.map(row=>row.id===item.id?{...row,done:!row.done}:row))}>Complete</button><button data-delete={item.id} onClick={()=>setItems(old=>old.filter(row=>row.id!==item.id))}>Delete</button>{advanced&&<button data-edit={item.id} onClick={()=>{setEditing(item.id);setEdit(item.title);}}>Edit</button>}{editing===item.id&&<label>Edit title<input aria-label=\"Edit title\" value={edit} onChange={e=>setEdit(e.target.value)}/><button data-save={item.id} onClick={()=>{if(!edit.trim())return;setItems(old=>old.map(row=>row.id===item.id?{...row,title:edit.trim()}:row));setEditing(null);}}>Save</button></label>}</li>)}</ul><output data-testid=\"total\">{items.length}</output></section>;}",
    "architectureNotes": "Follow-up: Add filtered views while retaining selection and edit state by task ID.\nTopic reference: https://namastedev.com/practice/todo-list\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "todo-list-correctness",
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
    "Add filtered views while retaining selection and edit state by task ID."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Blank title; repeated title with different IDs; complete/uncomplete.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "todo-list-variation",
      "question": "Add filtered views while retaining selection and edit state by task ID.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep an array of task records and update it immutably. Trim titles before insertion and reject blanks. Generate IDs at creation, not during rendering, so editing or reordering does not attach state to a different row. Derive completed totals from records rather than synchronizing another counter. Specify whether deleting a task is immediately permanent or undoable. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
