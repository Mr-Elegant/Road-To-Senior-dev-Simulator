# Reference: Frontend: Nested Comments

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Normalize comments by ID with parent IDs and ordered child lists, or use a carefully immutable tree. Keep editing drafts local to the chosen ID and avoid recursive index keys. Define deletion as subtree removal or a tombstone that preserves replies. Sanitize any supported rich content and derive displayed authors from trusted server records. Deep threads need bounded rendering and accessible reply context.",
    "codeOrArtifact": "import {useState,useRef} from 'react';export default function App(){const[comments,setComments]=useState([{id:'1',text:'Root',parent:null,deleted:false}]),[draft,setDraft]=useState(''),[parent,setParent]=useState(null),next=useRef(2);function add(){if(!draft.trim())return;const id=String(next.current++);setComments(old=>[...old,{id,text:draft.trim(),parent,deleted:false}]);setDraft('');setParent(null);}function render(p){return <ul>{comments.filter(c=>c.parent===p).map(c=><li key={c.id} data-comment={c.id}><span data-text={c.id}>{c.deleted?'[deleted]':c.text}</span><button data-reply={c.id} disabled={c.deleted} onClick={()=>setParent(c.id)}>Reply</button><button data-delete={c.id} onClick={()=>setComments(old=>old.map(item=>item.id===c.id?{...item,deleted:true}:item))}>Delete</button>{render(c.id)}</li>)}</ul>;}return <section><label>Text<input aria-label=\"Text\" value={draft} onChange={e=>setDraft(e.target.value)}/></label><button data-action=\"add\" onClick={add}>Add</button>{render(null)}</section>;}",
    "architectureNotes": "Follow-up: Add optimistic replies with temporary IDs and reconcile server acknowledgements without duplicating the thread.\nTopic reference: https://namastedev.com/practice/nested-comments\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "nested-comments-correctness",
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
    "Add optimistic replies with temporary IDs and reconcile server acknowledgements without duplicating the thread."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Reply to deleted comment; deep nesting; duplicate text.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "nested-comments-variation",
      "question": "Add optimistic replies with temporary IDs and reconcile server acknowledgements without duplicating the thread.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Normalize comments by ID with parent IDs and ordered child lists, or use a carefully immutable tree. Keep editing drafts local to the chosen ID and avoid recursive index keys. Define deletion as subtree removal or a tombstone that preserves replies. Sanitize any supported rich content and derive displayed authors from trusted server records. Deep threads need bounded rendering and accessible reply context. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
