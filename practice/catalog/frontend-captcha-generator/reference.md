# Reference: Frontend: Captcha Generator

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Generate a new challenge only when requested and compare the answer using the declared normalization policy. Track attempts against the current challenge so old answers cannot satisfy a new one. Explain that client-generated CAPTCHA content is inspectable and cannot provide a real abuse boundary. A production defense requires server authority and accessible alternatives.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({challenges=['AB12','CD34']}){const[index,setIndex]=useState(0),[value,setValue]=useState(''),[feedback,setFeedback]=useState('');return <section><p data-testid=\"challenge\">{challenges[index]}</p><label>Answer<input aria-label=\"Answer\" value={value} onChange={e=>setValue(e.target.value)}/></label><button data-action=\"verify\" onClick={()=>setFeedback(value.trim().toUpperCase()===challenges[index]?'Correct':'Incorrect')}>Verify</button><button data-action=\"regenerate\" onClick={()=>{setIndex(i=>(i+1)%challenges.length);setValue('');setFeedback('');}}>Regenerate</button><p data-testid=\"feedback\">{feedback}</p></section>;}",
    "architectureNotes": "Follow-up: Design an accessible server-validated alternative rather than obscuring text more aggressively.\nTopic reference: https://namastedev.com/practice/captcha-generator\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "captcha-generator-correctness",
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
    "Design an accessible server-validated alternative rather than obscuring text more aggressively."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Regenerate; answer for old challenge; case policy.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "captcha-generator-variation",
      "question": "Design an accessible server-validated alternative rather than obscuring text more aggressively.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Generate a new challenge only when requested and compare the answer using the declared normalization policy. Track attempts against the current challenge so old answers cannot satisfy a new one. Explain that client-generated CAPTCHA content is inspectable and cannot provide a real abuse boundary. A production defense requires server authority and accessible alternatives. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
