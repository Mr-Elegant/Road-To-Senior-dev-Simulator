# Reference: Frontend: Todo List II

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use task IDs for the collection and a separate editing ID/draft for an active edit. Commit or cancel deliberately instead of mutating the saved title on each keystroke. Persist a versioned data schema and recover gracefully from corrupt or unavailable storage. Read storage before enabling writes, otherwise the initial empty render can overwrite existing tasks.",
    "codeOrArtifact": "import {useState,useRef} from 'react';export default function App(){const[items,setItems]=useState([]),[draft,setDraft]=useState(''),[filter,setFilter]=useState('all'),[editing,setEditing]=useState(null),[edit,setEdit]=useState(''),next=useRef(1);const advanced=true;function add(){if(!draft.trim())return;const id=String(next.current++);setItems(old=>[...old,{id,title:draft.trim(),done:false}]);setDraft('');}return <section><label>New task<input name=\"draft\" aria-label=\"New task\" value={draft} onChange={e=>setDraft(e.target.value)}/></label><button data-action=\"add\" onClick={add}>Add</button>{advanced&&<label>Filter<select aria-label=\"Filter\" value={filter} onChange={e=>setFilter(e.target.value)}><option value=\"all\">All</option><option value=\"active\">Active</option><option value=\"done\">Done</option></select></label>}<ul>{items.filter(item=>filter==='all'||(filter==='done'?item.done:!item.done)).map(item=><li key={item.id} data-id={item.id} data-done={item.done}><span data-title>{item.title}</span><button data-toggle={item.id} aria-pressed={item.done} onClick={()=>setItems(old=>old.map(row=>row.id===item.id?{...row,done:!row.done}:row))}>Complete</button><button data-delete={item.id} onClick={()=>setItems(old=>old.filter(row=>row.id!==item.id))}>Delete</button>{advanced&&<button data-edit={item.id} onClick={()=>{setEditing(item.id);setEdit(item.title);}}>Edit</button>}{editing===item.id&&<label>Edit title<input aria-label=\"Edit title\" value={edit} onChange={e=>setEdit(e.target.value)}/><button data-save={item.id} onClick={()=>{if(!edit.trim())return;setItems(old=>old.map(row=>row.id===item.id?{...row,title:edit.trim()}:row));setEditing(null);}}>Save</button></label>}</li>)}</ul><output data-testid=\"total\">{items.length}</output></section>;}",
    "architectureNotes": "Follow-up: Migrate an older storage schema and reconcile edits from two browser tabs.\nTopic reference: https://namastedev.com/practice/todo-list-ii\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "todo-list-ii-correctness",
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
    "Migrate an older storage schema and reconcile edits from two browser tabs."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Cancel edit; blank edited title; corrupt storage.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "todo-list-ii-variation",
      "question": "Migrate an older storage schema and reconcile edits from two browser tabs.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use task IDs for the collection and a separate editing ID/draft for an active edit. Commit or cancel deliberately instead of mutating the saved title on each keystroke. Persist a versioned data schema and recover gracefully from corrupt or unavailable storage. Read storage before enabling writes, otherwise the initial empty render can overwrite existing tasks. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
