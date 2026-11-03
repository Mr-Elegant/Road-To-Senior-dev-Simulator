# Reference: Frontend: Frequently Asked Questions

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Represent FAQ items by stable IDs and derive matches from normalized question/body text. Keep expansion separate from the filtered array, so hiding a row is not mistaken for deleting it. Use native heading buttons and associated answer regions. Specify whether multiple answers may remain expanded, and provide a useful no-results state.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({items=[]}){const[query,setQuery]=useState(''),[open,setOpen]=useState([]);const visible=items.filter(item=>(item.title+' '+item.body).toLowerCase().includes(query.trim().toLowerCase()));return <section><label>Search<input aria-label=\"Search\" value={query} onChange={e=>setQuery(e.target.value)}/></label>{visible.map(item=><article key={item.id}><button data-id={item.id} aria-expanded={open.includes(item.id)} onClick={()=>setOpen(old=>old.includes(item.id)?old.filter(id=>id!==item.id):[...old,item.id])}>{item.title}</button>{open.includes(item.id)&&<div role=\"region\" id={'answer-'+item.id}>{item.body}</div>}</article>)}{!visible.length&&<p>No matching answers</p>}</section>;}",
    "architectureNotes": "Follow-up: Group results by category while avoiding duplicate IDs in accessibility relationships.\nTopic reference: https://namastedev.com/practice/frequently-asked-questions\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "frequently-asked-questions-correctness",
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
    "Group results by category while avoiding duplicate IDs in accessibility relationships."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Search body text; no matches; clear search.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "frequently-asked-questions-variation",
      "question": "Group results by category while avoiding duplicate IDs in accessibility relationships.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Represent FAQ items by stable IDs and derive matches from normalized question/body text. Keep expansion separate from the filtered array, so hiding a row is not mistaken for deleting it. Use native heading buttons and associated answer regions. Specify whether multiple answers may remain expanded, and provide a useful no-results state. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
