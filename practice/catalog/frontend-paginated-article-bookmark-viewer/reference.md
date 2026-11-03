# Reference: Frontend: Paginated Article Bookmark Viewer

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store page/query controls and bookmarked article IDs separately. Apply the documented order of filtering, sorting, and paging, then clamp the page when the result count shrinks. A hidden article may remain bookmarked. Distinguish local bookmark intent from server acknowledgement, and never use a page-local array index as article identity.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({items=['A','B','C','D','E'],pageSize=2}){const[page,setPage]=useState(0),[saved,setSaved]=useState([]),max=Math.max(0,Math.ceil(items.length/pageSize)-1);return <section><ul>{items.slice(page*pageSize,page*pageSize+pageSize).map(id=><li key={id} data-article={id}>{id}<button data-bookmark={id} aria-pressed={saved.includes(id)} onClick={()=>setSaved(old=>old.includes(id)?old.filter(v=>v!==id):[...old,id])}>Bookmark {id}</button></li>)}</ul><button data-action=\"previous\" onClick={()=>setPage(n=>Math.max(0,n-1))}>Previous</button><button data-action=\"next\" onClick={()=>setPage(n=>Math.min(max,n+1))}>Next</button><output data-testid=\"page\">{items.length?page+1:0}</output><output data-testid=\"saved\">{saved.join(',')}</output></section>;}",
    "architectureNotes": "Follow-up: Add remote pagination with stale-response protection and explicit loading/error states.\nTopic reference: https://namastedev.com/practice/paginated-article-bookmark-viewer\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "paginated-article-bookmark-viewer-correctness",
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
    "Add remote pagination with stale-response protection and explicit loading/error states."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Bookmark across pages; filter shrinks total; empty page.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "paginated-article-bookmark-viewer-variation",
      "question": "Add remote pagination with stale-response protection and explicit loading/error states.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store page/query controls and bookmarked article IDs separately. Apply the documented order of filtering, sorting, and paging, then clamp the page when the result count shrinks. A hidden article may remain bookmarked. Distinguish local bookmark intent from server acknowledgement, and never use a page-local array index as article identity. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
