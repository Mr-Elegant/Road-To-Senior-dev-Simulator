# Reference: Frontend: Draw Circles

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Convert client coordinates to local surface coordinates using its bounding rectangle, and account for scaling if logical and CSS sizes differ. Store immutable circle records with stable IDs. Pointer events support mouse, touch, and pen through one path. A click outside the drawable area must not create invalid geometry.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[x,setX]=useState(''),[y,setY]=useState(''),[points,setPoints]=useState([]),[error,setError]=useState('');function add(){const a=Number(x),b=Number(y);if(!x.trim()||!y.trim()||![a,b].every(Number.isFinite)||a<0||a>200||b<0||b>200){setError('Invalid position');return;}setPoints(old=>[...old,[a,b]]);setError('');}return <section><label>X<input name=\"x\" value={x} onChange={e=>setX(e.target.value)}/></label><label>Y<input name=\"y\" value={y} onChange={e=>setY(e.target.value)}/></label><button data-action=\"add\" onClick={add}>Add circle</button><button data-action=\"undo\" onClick={()=>setPoints(old=>old.slice(0,-1))}>Undo</button><button data-action=\"clear\" onClick={()=>setPoints([])}>Clear</button><svg viewBox=\"0 0 200 200\" aria-label=\"Drawing\">{points.map(([a,b],i)=><circle key={i} cx={a} cy={b} r=\"10\"/>)}</svg><p role=\"alert\">{error}</p></section>;}",
    "architectureNotes": "Follow-up: Add redo and a keyboard placement mode without coupling geometry to browser viewport coordinates.\nTopic reference: https://namastedev.com/practice/draw-circles\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "draw-circles-correctness",
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
    "Add redo and a keyboard placement mode without coupling geometry to browser viewport coordinates."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Scrolled page; scaled surface; boundary click.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "draw-circles-variation",
      "question": "Add redo and a keyboard placement mode without coupling geometry to browser viewport coordinates.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Convert client coordinates to local surface coordinates using its bounding rectangle, and account for scaling if logical and CSS sizes differ. Store immutable circle records with stable IDs. Pointer events support mouse, touch, and pen through one path. A click outside the drawable area must not create invalid geometry. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
