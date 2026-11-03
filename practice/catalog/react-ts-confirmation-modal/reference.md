# Reference: React + TypeScript: Confirmation Modal

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep pending intent separate from the confirmed action. Prefer a native dialog opened with showModal so background content becomes inert. Provide a title, clear confirm/cancel names, Escape cancellation, and deliberate initial focus. Commit the action only on confirmation and restore focus to the original trigger after closing.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useRef, useState } from 'react';\nexport default function App(): React.JSX.Element { const dialog = useRef<HTMLDialogElement>(null), trigger = useRef<HTMLButtonElement>(null), [deleted, setDeleted] = useState(0); function close() { dialog.current?.close(); trigger.current?.focus(); } return <section><button data-action=\"delete\" ref={trigger} onClick={() => dialog.current?.showModal()}>Delete</button><output data-testid=\"deleted\">{deleted}</output><dialog ref={dialog} aria-labelledby=\"confirm-title\" onCancel={e => { e.preventDefault(); close(); }} onKeyDown={e => { if (e.key === 'Escape') {\n    e.preventDefault();\n    close();\n} }}><h2 id=\"confirm-title\">Confirm deletion</h2><button data-action=\"confirm\" onClick={() => { setDeleted(n => n + 1); close(); }}>Confirm</button><button data-action=\"cancel\" onClick={close}>Cancel</button></dialog></section>; }\n",
    "architectureNotes": "Follow-up: Represent asynchronous confirmation with a pending state and prevent accidental duplicate execution.\nTopic reference: https://namastedev.com/practice/confirmation-modal\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-confirmation-modal. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "confirmation-modal-correctness",
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
    "Represent asynchronous confirmation with a pending state and prevent accidental duplicate execution."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Cancel; Escape; confirm exactly once.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "confirmation-modal-variation",
      "question": "Represent asynchronous confirmation with a pending state and prevent accidental duplicate execution.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep pending intent separate from the confirmed action. Prefer a native dialog opened with showModal so background content becomes inert. Provide a title, clear confirm/cancel names, Escape cancellation, and deliberate initial focus. Commit the action only on confirmation and restore focus to the original trigger after closing. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
