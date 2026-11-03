# Reference: React + TypeScript: Copy to Clipboard

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Invoke clipboard writing from a user gesture and await its promise. Treat unsupported or rejected access as a real failure, with a selectable-text or legacy copy fallback where appropriate. Keep copied feedback separate from the input, clear its timer on unmount, and avoid announcing success before permission or browser restrictions are known.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    adapter?: string;\n}\nimport { useState } from 'react';\nexport default function App({ adapter = 'success' }: AppProps = {}): React.JSX.Element { const [value, setValue] = useState(''), [status, setStatus] = useState('Ready'), [copied, setCopied] = useState(''); async function copy() { const snapshot = value; setStatus('Copying'); setCopied(''); try {\n    await (adapter === 'success' ? Promise.resolve() : Promise.reject(new Error('Unavailable')));\n    setCopied(snapshot);\n    setStatus('Copied');\n}\ncatch {\n    setStatus('Copy unavailable');\n} } return <section><label>Text<input aria-label=\"Text\" value={value} onChange={e => setValue(e.target.value)}/></label><button onClick={copy}>Copy</button><p data-testid=\"status\" role=\"status\">{status}</p><output data-testid=\"copied\">{copied}</output></section>; }\n",
    "architectureNotes": "Follow-up: Add a copyable code block whose feedback resets when its source changes.\nTopic reference: https://namastedev.com/practice/copy-to-clipboard\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-copy-to-clipboard. The TypeScript copy uses a separate scenario ID and attempt history."
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
