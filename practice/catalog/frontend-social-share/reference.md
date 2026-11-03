# Reference: Frontend: Social Share

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Invoke the Web Share API from a user gesture when supported and fall back to a copyable URL or explicit provider links. Encode URL parameters separately instead of concatenating unescaped text. Treat user cancellation differently from a platform error. New-window links need a deliberate relationship policy and all icon controls need accessible names.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({adapter='success',url='https://example.test/article'}){const[status,setStatus]=useState('Ready');async function share(){setStatus('Sharing');await Promise.resolve();setStatus(adapter==='success'?'Shared':adapter==='cancel'?'Cancelled':'Copy link instead');}return <section><button onClick={share}>Share</button><p data-testid=\"status\">{status}</p>{status==='Copy link instead'&&<label>Link<input aria-label=\"Link\" readOnly value={url}/></label>}</section>;}",
    "architectureNotes": "Follow-up: Add file sharing using capability checks without assuming every browser accepts the same file types.\nTopic reference: https://namastedev.com/practice/social-share\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "social-share-correctness",
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
    "Add file sharing using capability checks without assuming every browser accepts the same file types."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Native support missing; user cancels; URL with reserved characters.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "social-share-variation",
      "question": "Add file sharing using capability checks without assuming every browser accepts the same file types.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Invoke the Web Share API from a user gesture when supported and fall back to a copyable URL or explicit provider links. Encode URL parameters separately instead of concatenating unescaped text. Treat user cancellation differently from a platform error. New-window links need a deliberate relationship policy and all icon controls need accessible names. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
