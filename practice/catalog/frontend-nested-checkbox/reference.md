# Reference: Frontend: Nested Checkbox

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store selected leaves or an equivalent normalized model. Derive a parent’s checked and indeterminate states from descendant coverage; indeterminate is a DOM property, not merely an attribute. Parent activation applies a documented action to all eligible descendants. Keep IDs unique and define disabled-subtree behavior explicitly. Avoid storing contradictory parent and child booleans independently.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({tree={id:'root',label:'All',children:[{id:'a',label:'A'},{id:'b',label:'B'}]}}){const[selected,setSelected]=useState([]);function leaves(node){return node.children?.length?node.children.flatMap(leaves):[node.id];}function render(node){const ids=leaves(node),n=ids.filter(id=>selected.includes(id)).length,all=n===ids.length,some=n>0&&!all;return <li key={node.id}><label><input type=\"checkbox\" data-node={node.id} data-state={all?'checked':some?'mixed':'unchecked'} checked={all} ref={el=>{if(el)el.indeterminate=some;}} onChange={()=>setSelected(old=>all?old.filter(id=>!ids.includes(id)):[...new Set([...old,...ids])])}/>{node.label}</label>{node.children?.length>0&&<ul>{node.children.map(render)}</ul>}</li>;}return <section><ul>{render(tree)}</ul><output data-testid=\"selected\">{[...selected].sort().join(',')}</output></section>;}",
    "architectureNotes": "Follow-up: Support lazy-loaded children without incorrectly declaring an incompletely known subtree fully selected.\nTopic reference: https://namastedev.com/practice/nested-checkbox\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "nested-checkbox-correctness",
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
    "Support lazy-loaded children without incorrectly declaring an incompletely known subtree fully selected."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: All/none/some leaves; disabled descendant; empty branch.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "nested-checkbox-variation",
      "question": "Support lazy-loaded children without incorrectly declaring an incompletely known subtree fully selected.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store selected leaves or an equivalent normalized model. Derive a parent’s checked and indeterminate states from descendant coverage; indeterminate is a DOM property, not merely an attribute. Parent activation applies a documented action to all eligible descendants. Keep IDs unique and define disabled-subtree behavior explicitly. Avoid storing contradictory parent and child booleans independently. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
