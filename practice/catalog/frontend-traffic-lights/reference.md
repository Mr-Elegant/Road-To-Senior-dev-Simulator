# Reference: Frontend: Traffic Lights

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Represent the active light and a transition table containing the next state and duration. Schedule one timeout for the current state and cancel it on pause, state change, or unmount. Use functional transitions or a reducer to avoid stale closures. Make color labels visible; this UI demonstration is not a physical traffic-control safety system.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[index,setIndex]=useState(0),[paused,setPaused]=useState(false);return <section><output data-testid=\"light\">{['red','green','amber'][index]}</output><button data-action=\"advance\" onClick={()=>{if(!paused)setIndex(i=>(i+1)%3);}}>Advance</button><button data-action=\"pause\" aria-pressed={paused} onClick={()=>setPaused(v=>!v)}>Pause</button></section>;}",
    "architectureNotes": "Follow-up: Introduce an all-red transition state and validate that no path activates conflicting lights.\nTopic reference: https://namastedev.com/practice/traffic-lights\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "traffic-lights-correctness",
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
    "Introduce an all-red transition state and validate that no path activates conflicting lights."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Transition sequence; pause/resume policy; unmount.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "traffic-lights-variation",
      "question": "Introduce an all-red transition state and validate that no path activates conflicting lights.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Represent the active light and a transition table containing the next state and duration. Schedule one timeout for the current state and cancel it on pause, state change, or unmount. Use functional transitions or a reducer to avoid stale closures. Make color labels visible; this UI demonstration is not a physical traffic-control safety system. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
