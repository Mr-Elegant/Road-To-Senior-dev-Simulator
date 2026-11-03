# Reference: Frontend: Back To Top

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Subscribe to scrolling once, use a passive listener, and coalesce measurement with requestAnimationFrame if needed. Track only whether the threshold is crossed instead of rerendering for every pixel. Use a native button with a descriptive name and choose instant scrolling when reduced motion is requested. Remove the listener and cancel pending work on unmount.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({initialY=0,threshold=200}){const[y,setY]=useState(initialY);return <section><output data-testid=\"position\">{y}</output>{y>threshold&&<button onClick={()=>setY(0)}>Back to top</button>}</section>;}",
    "architectureNotes": "Follow-up: Make the threshold relative to a scrollable container rather than the browser window.\nTopic reference: https://namastedev.com/practice/back-to-top\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "back-to-top-correctness",
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
    "Make the threshold relative to a scrollable container rather than the browser window."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Threshold boundary; initial deep scroll; click return.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "back-to-top-variation",
      "question": "Make the threshold relative to a scrollable container rather than the browser window.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Subscribe to scrolling once, use a passive listener, and coalesce measurement with requestAnimationFrame if needed. Track only whether the threshold is crossed instead of rerendering for every pixel. Use a native button with a descriptive name and choose instant scrolling when reduced motion is requested. Remove the listener and cancel pending work on unmount. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
