# Reference: Frontend: Pagination

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Choose offset or cursor semantics before building controls. For offset paging, apply filters/sort before slicing and clamp the current page after totals change. For cursor paging, preserve server cursors and avoid inventing random page access. Key requests by the complete query configuration and reject stale responses. Loading a new page should not erase already usable navigation unnecessarily.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({items=['Alpha','Beta','Gamma','Delta','Epsilon'],pageSize=2}){const[query,setQuery]=useState(''),[descending,setDescending]=useState(false),[page,setPage]=useState(0);const filtered=items.filter(value=>value.toLowerCase().includes(query.trim().toLowerCase())).sort((a,b)=>(a<b?-1:a>b?1:0)*(descending?-1:1)),pages=Math.ceil(filtered.length/pageSize),current=Math.min(page,Math.max(0,pages-1));return <section><label>Search<input aria-label=\"Search\" value={query} onChange={e=>{setQuery(e.target.value);setPage(0);}}/></label><button data-action=\"sort\" onClick={()=>{setDescending(v=>!v);setPage(0);}}>Sort</button><ul>{filtered.slice(current*pageSize,current*pageSize+pageSize).map(value=><li key={value}>{value}</li>)}</ul><button data-action=\"previous\" onClick={()=>setPage(n=>Math.max(0,n-1))}>Previous</button><button data-action=\"next\" onClick={()=>setPage(n=>Math.min(Math.max(0,pages-1),n+1))}>Next</button><output data-testid=\"page\">{(pages?current+1:0)+'/'+pages}</output></section>;}",
    "architectureNotes": "Follow-up: Compare offset and keyset pagination under concurrent inserts using a stable unique tie-breaker.\nTopic reference: https://namastedev.com/practice/pagination\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "pagination-correctness",
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
    "Compare offset and keyset pagination under concurrent inserts using a stable unique tie-breaker."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Filter shrinks pages; request race; zero results.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "pagination-variation",
      "question": "Compare offset and keyset pagination under concurrent inserts using a stable unique tie-breaker.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Choose offset or cursor semantics before building controls. For offset paging, apply filters/sort before slicing and clamp the current page after totals change. For cursor paging, preserve server cursors and avoid inventing random page access. Key requests by the complete query configuration and reject stale responses. Loading a new page should not erase already usable navigation unnecessarily. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
