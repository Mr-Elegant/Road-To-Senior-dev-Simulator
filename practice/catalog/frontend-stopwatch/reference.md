# Reference: Frontend: Stopwatch

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use a monotonic clock for elapsed duration, storing accumulated time and the current run’s start timestamp. The interval requests redraws; it is not the source of elapsed truth. Pausing adds the difference to the accumulated duration, and resuming starts a new segment. Clean up the refresh interval and define reset behavior while running.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[seconds,setSeconds]=useState(0),[running,setRunning]=useState(false);return <section><output data-testid=\"seconds\">{seconds}</output><button data-action=\"start\" onClick={()=>setRunning(true)}>Start</button><button data-action=\"pause\" onClick={()=>setRunning(false)}>Pause</button><button data-action=\"tick\" onClick={()=>{if(running)setSeconds(n=>n+1);}}>Tick</button><button data-action=\"reset\" onClick={()=>{setRunning(false);setSeconds(0);}}>Reset</button></section>;}",
    "architectureNotes": "Follow-up: Add lap times and verify that background-tab throttling does not cause elapsed time to drift.\nTopic reference: https://namastedev.com/practice/stopwatch\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "stopwatch-correctness",
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
    "Add lap times and verify that background-tab throttling does not cause elapsed time to drift."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Start/pause/resume; reset; delayed interval.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "stopwatch-variation",
      "question": "Add lap times and verify that background-tab throttling does not cause elapsed time to drift.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use a monotonic clock for elapsed duration, storing accumulated time and the current run’s start timestamp. The interval requests redraws; it is not the source of elapsed truth. Pausing adds the difference to the accumulated duration, and resuming starts a new segment. Clean up the refresh interval and define reset behavior while running. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
