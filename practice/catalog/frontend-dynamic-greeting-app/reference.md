# Reference: Frontend: Dynamic Greeting App

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep the name editable, trim it for display, and use a fallback for blank names. Pass or inject the current time so tests are deterministic. If the greeting must change over time, own a timer with cleanup; reading the clock once does not create a live clock. Specify the timezone instead of assuming every user shares the server clock.",
    "codeOrArtifact": "import {useState} from 'react'; export default function App({hour=9}) { const [name,setName]=useState(''); const period=hour<12?'morning':hour<18?'afternoon':'evening'; return <section><label>Name<input aria-label=\"Name\" value={name} onChange={e=>setName(e.target.value)} /></label><p data-testid=\"greeting\">{'Good '+period+', '+(name.trim()||'friend')+'!'}</p></section>; }",
    "architectureNotes": "Follow-up: Show a user-selected timezone and handle the case where the device time changes.\nTopic reference: https://namastedev.com/practice/dynamic-greeting-app\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "dynamic-greeting-app-correctness",
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
    "Show a user-selected timezone and handle the case where the device time changes."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Blank name; whitespace; morning boundary.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "dynamic-greeting-app-variation",
      "question": "Show a user-selected timezone and handle the case where the device time changes.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep the name editable, trim it for display, and use a fallback for blank names. Pass or inject the current time so tests are deterministic. If the greeting must change over time, own a timer with cleanup; reading the clock once does not create a live clock. Specify the timezone instead of assuming every user shares the server clock. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
