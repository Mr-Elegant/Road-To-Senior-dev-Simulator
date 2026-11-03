# Reference: Frontend: Transfer List

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use stable IDs and two membership collections, plus a set of checked IDs. A transfer moves only eligible checked records, preserves order, and clears or reconciles checks according to the contract. Derive select-all and indeterminate states from actual eligible membership. Disable moves that would do nothing.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({initialLeft=['A','B','C'],initialRight=[]}){const[left,setLeft]=useState(initialLeft),[right,setRight]=useState(initialRight),[checked,setChecked]=useState([]);function toggle(id){setChecked(old=>old.includes(id)?old.filter(v=>v!==id):[...old,id]);}function move(toRight){const source=toRight?left:right,chosen=source.filter(id=>checked.includes(id)),remaining=source.filter(id=>!checked.includes(id));if(toRight){setLeft(remaining);setRight(old=>[...old,...chosen]);}else{setRight(remaining);setLeft(old=>[...old,...chosen]);}setChecked([]);}return <section>{[['left',left],['right',right]].map(([name,items])=><ul key={name} data-testid={name}>{items.map(id=><li key={id}><label><input type=\"checkbox\" data-check={id} checked={checked.includes(id)} onChange={()=>toggle(id)}/>{id}</label></li>)}</ul>)}<button data-action=\"right\" onClick={()=>move(true)}>Move right</button><button data-action=\"left\" onClick={()=>move(false)}>Move left</button><output data-testid=\"left-order\">{left.join(',')}</output><output data-testid=\"right-order\">{right.join(',')}</output></section>;}",
    "architectureNotes": "Follow-up: Add per-list search while defining whether Select all affects visible or all eligible records.\nTopic reference: https://namastedev.com/practice/transfer-list\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "transfer-list-correctness",
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
    "Add per-list search while defining whether Select all affects visible or all eligible records."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: No selection; move all; partial selection.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "transfer-list-variation",
      "question": "Add per-list search while defining whether Select all affects visible or all eligible records.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use stable IDs and two membership collections, plus a set of checked IDs. A transfer moves only eligible checked records, preserves order, and clears or reconciles checks according to the contract. Derive select-all and indeterminate states from actual eligible membership. Disable moves that would do nothing. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
