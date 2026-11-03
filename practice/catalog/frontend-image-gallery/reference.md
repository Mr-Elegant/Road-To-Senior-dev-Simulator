# Reference: Frontend: Image Gallery

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep selected image ID separate from the underlying list. Use thumbnail buttons with names and open the large image in a labelled dialog if modal viewing is intended. Preserve alternative text and handle missing sources. Reconcile selection when images are removed, and defer large-image loading without shifting the layout unexpectedly.",
    "codeOrArtifact": "import {useState,useRef} from 'react';export default function App({items=['Alpha','Beta','Gamma']}){const[index,setIndex]=useState(0),dialog=useRef(null);const kind=\"gallery\",slots=kind==='cards'?2:1,max=Math.max(0,items.length-slots);if(!items.length)return <p>No images</p>;const position=Math.min(index,max);function move(delta){setIndex(i=>kind==='image'?(i+delta+items.length)%items.length:Math.max(0,Math.min(max,i+delta)));}return <section>{kind==='gallery'&&items.map((title,i)=><button key={i} data-thumbnail={i} onClick={()=>{setIndex(i);dialog.current.showModal();}}>{title}</button>)}<div data-testid=\"slides\">{items.slice(position,position+slots).map(title=><article key={title}><img alt={title} src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==\"/><h2>{title}</h2></article>)}</div><button data-action=\"previous\" onClick={()=>move(-1)}>Previous</button><button data-action=\"next\" onClick={()=>move(1)}>Next</button>{kind==='gallery'&&<dialog ref={dialog} aria-label=\"Image viewer\"><h2 data-testid=\"viewer\">{items[index]}</h2><button data-action=\"close\" onClick={()=>dialog.current.close()}>Close viewer</button></dialog>}</section>;}",
    "architectureNotes": "Follow-up: Add a predictable focus policy for keyboard navigation between thumbnails and the lightbox.\nTopic reference: https://namastedev.com/practice/image-gallery\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "image-gallery-correctness",
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
    "Add a predictable focus policy for keyboard navigation between thumbnails and the lightbox."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Empty gallery; broken source; opening/closing.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "image-gallery-variation",
      "question": "Add a predictable focus policy for keyboard navigation between thumbnails and the lightbox.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep selected image ID separate from the underlying list. Use thumbnail buttons with names and open the large image in a labelled dialog if modal viewing is intended. Preserve alternative text and handle missing sources. Reconcile selection when images are removed, and defer large-image loading without shifting the layout unexpectedly. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
