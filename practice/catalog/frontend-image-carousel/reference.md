# Reference: Frontend: Image Carousel

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep an active index and derive the current slide from the image list. State whether navigation wraps or stops at the ends. Clamp or reconcile the index when data changes. Provide descriptive controls, meaningful alternative text, and a non-disruptive slide announcement. Optional autoplay requires cleanup, pause conditions, and reduced-motion support.",
    "codeOrArtifact": "import {useState,useRef} from 'react';export default function App({items=['Alpha','Beta','Gamma']}){const[index,setIndex]=useState(0),dialog=useRef(null);const kind=\"image\",slots=kind==='cards'?2:1,max=Math.max(0,items.length-slots);if(!items.length)return <p>No images</p>;const position=Math.min(index,max);function move(delta){setIndex(i=>kind==='image'?(i+delta+items.length)%items.length:Math.max(0,Math.min(max,i+delta)));}return <section>{kind==='gallery'&&items.map((title,i)=><button key={i} data-thumbnail={i} onClick={()=>{setIndex(i);dialog.current.showModal();}}>{title}</button>)}<div data-testid=\"slides\">{items.slice(position,position+slots).map(title=><article key={title}><img alt={title} src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==\"/><h2>{title}</h2></article>)}</div><button data-action=\"previous\" onClick={()=>move(-1)}>Previous</button><button data-action=\"next\" onClick={()=>move(1)}>Next</button>{kind==='gallery'&&<dialog ref={dialog} aria-label=\"Image viewer\"><h2 data-testid=\"viewer\">{items[index]}</h2><button data-action=\"close\" onClick={()=>dialog.current.close()}>Close viewer</button></dialog>}</section>;}",
    "architectureNotes": "Follow-up: Pause autoplay on interaction/focus and resume only under an explicit user-controlled policy.\nTopic reference: https://namastedev.com/practice/image-carousel\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "image-carousel-correctness",
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
    "Pause autoplay on interaction/focus and resume only under an explicit user-controlled policy."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: No images; one image; endpoints.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "image-carousel-variation",
      "question": "Pause autoplay on interaction/focus and resume only under an explicit user-controlled policy.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep an active index and derive the current slide from the image list. State whether navigation wraps or stops at the ends. Clamp or reconcile the index when data changes. Provide descriptive controls, meaningful alternative text, and a non-disruptive slide announcement. Optional autoplay requires cleanup, pause conditions, and reduced-motion support. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
