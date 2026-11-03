# Reference: Frontend: Confetti Animation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Create a finite particle set at the celebration boundary and animate transforms/opacity rather than layout properties. Stop and remove particles when the effect ends or the component unmounts. Cap simultaneous effects and avoid blocking the main thread with per-particle React state updates. Respect reduced-motion preferences with a simpler static acknowledgement.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({count=8,reducedMotion=false}){const[active,setActive]=useState(false);return <section><style>{'@keyframes fall{from{transform:translateY(-10px);opacity:1}to{transform:translateY(30px);opacity:0}}'}</style><button data-action=\"celebrate\" onClick={()=>setActive(true)}>Celebrate</button><button data-action=\"clear\" onClick={()=>setActive(false)}>Clear</button><div aria-hidden=\"true\">{active&&!reducedMotion&&Array.from({length:count},(_,i)=><span data-particle key={i} style={{display:'inline-block',animation:'fall 600ms ease-out'}}>✦</span>)}</div><p role=\"status\">{active?'Celebration complete':''}</p></section>;}",
    "architectureNotes": "Follow-up: Move a larger particle simulation to canvas while bounding frame work and lifetime.\nTopic reference: https://namastedev.com/practice/confetti-animation\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "confetti-animation-correctness",
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
    "Move a larger particle simulation to canvas while bounding frame work and lifetime."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Repeated trigger; unmount; zero particles.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "confetti-animation-variation",
      "question": "Move a larger particle simulation to canvas while bounding frame work and lifetime.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Create a finite particle set at the celebration boundary and animate transforms/opacity rather than layout properties. Stop and remove particles when the effect ends or the component unmounts. Cap simultaneous effects and avoid blocking the main thread with per-particle React state updates. Respect reduced-motion preferences with a simpler static acknowledgement. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
