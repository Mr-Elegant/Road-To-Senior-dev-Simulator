# Reference: Frontend: Data Table

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep query controls and selected row IDs separate from the dataset. Define whether transformations occur locally or on the server and apply a consistent ordering pipeline. Native table markup preserves row/column relationships; sortable headers expose aria-sort. Selection across pages must use stable IDs and an explicit select-all scope. Virtualization, editing, and grids add interaction complexity beyond a plain table.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({rows=[{id:'a',name:'Ada',score:2},{id:'b',name:'Lin',score:1},{id:'c',name:'Zoe',score:3}]}){const[query,setQuery]=useState(''),[descending,setDescending]=useState(false),[page,setPage]=useState(0),[selected,setSelected]=useState([]);const matches=rows.filter(r=>r.name.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>(a.score-b.score)*(descending?-1:1)||(a.id<b.id?-1:a.id>b.id?1:0)),max=Math.max(0,Math.ceil(matches.length/2)-1);return <section><label>Search<input aria-label=\"Search\" value={query} onChange={e=>{setQuery(e.target.value);setPage(0);}}/></label><table><caption>Records</caption><thead><tr><th scope=\"col\">Select</th><th scope=\"col\">Name</th><th scope=\"col\" aria-sort={descending?'descending':'ascending'}><button data-action=\"sort\" onClick={()=>{setDescending(v=>!v);setPage(0);}}>Score</button></th></tr></thead><tbody>{matches.slice(page*2,page*2+2).map(row=><tr key={row.id} data-row={row.id} data-selected={selected.includes(row.id)}><td><input type=\"checkbox\" data-select={row.id} aria-label={'Select '+row.name} checked={selected.includes(row.id)} onChange={()=>setSelected(old=>old.includes(row.id)?old.filter(id=>id!==row.id):[...old,row.id])}/></td><td data-name>{row.name}</td><td>{row.score}</td></tr>)}</tbody></table><button data-action=\"previous\" onClick={()=>setPage(n=>Math.max(0,n-1))}>Previous</button><button data-action=\"next\" onClick={()=>setPage(n=>Math.min(max,n+1))}>Next</button><output data-testid=\"selected\">{selected.length}</output></section>;}",
    "architectureNotes": "Follow-up: Support server-side select-all as a query plus exclusions rather than downloading every row ID.\nTopic reference: https://namastedev.com/practice/data-table\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "data-table-correctness",
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
    "Support server-side select-all as a query plus exclusions rather than downloading every row ID."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Sort ties; selection across pages; empty result.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "data-table-variation",
      "question": "Support server-side select-all as a query plus exclusions rather than downloading every row ID.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep query controls and selected row IDs separate from the dataset. Define whether transformations occur locally or on the server and apply a consistent ordering pipeline. Native table markup preserves row/column relationships; sortable headers expose aria-sort. Selection across pages must use stable IDs and an explicit select-all scope. Virtualization, editing, and grids add interaction complexity beyond a plain table. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
