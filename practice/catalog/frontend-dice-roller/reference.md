# Reference: Frontend: Dice Roller

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Validate die count and sides, then generate each result once in the roll handler rather than during rendering. Store the outcomes and derive the total. Inject the random source for deterministic tests. Use integer mapping appropriate to the random source and avoid claiming that a decorative animation proves fairness.",
    "codeOrArtifact": "import {useState,useRef} from 'react';export default function App({draws=[0],sides=6}){const[index,setIndex]=useState(0),[value,setValue]=useState(null);return <section><button onClick={()=>{setValue(Math.floor((draws[index]??0)*sides)+1);setIndex(i=>i+1);}}>Roll</button><output data-testid=\"roll\">{value===null?'-':value}</output></section>;}",
    "architectureNotes": "Follow-up: Replace pseudorandom rolls with a cryptographic uniform integer sampler and explain modulo bias.\nTopic reference: https://namastedev.com/practice/dice-roller\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "dice-roller-correctness",
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
    "Replace pseudorandom rolls with a cryptographic uniform integer sampler and explain modulo bias."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Minimum sides; multiple dice; deterministic random source.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "dice-roller-variation",
      "question": "Replace pseudorandom rolls with a cryptographic uniform integer sampler and explain modulo bias.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Validate die count and sides, then generate each result once in the roll handler rather than during rendering. Store the outcomes and derive the total. Inject the random source for deterministic tests. Use integer mapping appropriate to the random source and avoid claiming that a decorative animation proves fairness. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
