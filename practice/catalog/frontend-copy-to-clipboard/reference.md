# Reference: Frontend: Copy to Clipboard

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Invoke clipboard writing from a user gesture and await its promise. Treat unsupported or rejected access as a real failure, with a selectable-text or legacy copy fallback where appropriate. Keep copied feedback separate from the input, clear its timer on unmount, and avoid announcing success before permission or browser restrictions are known.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({adapter='success'}){const[value,setValue]=useState(''),[status,setStatus]=useState('Ready'),[copied,setCopied]=useState('');async function copy(){const snapshot=value;setStatus('Copying');setCopied('');try{await(adapter==='success'?Promise.resolve():Promise.reject(new Error('Unavailable')));setCopied(snapshot);setStatus('Copied');}catch{setStatus('Copy unavailable');}}return <section><label>Text<input aria-label=\"Text\" value={value} onChange={e=>setValue(e.target.value)}/></label><button onClick={copy}>Copy</button><p data-testid=\"status\" role=\"status\">{status}</p><output data-testid=\"copied\">{copied}</output></section>;}",
    "architectureNotes": "Follow-up: Add a copyable code block whose feedback resets when its source changes.\nTopic reference: https://namastedev.com/practice/copy-to-clipboard\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "copy-to-clipboard-correctness",
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
    "Add a copyable code block whose feedback resets when its source changes."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Successful copy; rejected permission; unavailable API.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "copy-to-clipboard-variation",
      "question": "Add a copyable code block whose feedback resets when its source changes.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Invoke clipboard writing from a user gesture and await its promise. Treat unsupported or rejected access as a real failure, with a selectable-text or legacy copy fallback where appropriate. Keep copied feedback separate from the input, clear its timer on unmount, and avoid announcing success before permission or browser restrictions are known. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
