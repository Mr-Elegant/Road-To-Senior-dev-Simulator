# Reference: React + TypeScript: Auto Save Text

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep the editable draft separate from the last acknowledged revision. Debounce writes with effect cleanup, and attach a revision to each save so a late response cannot mark newer text saved. Local storage writes can throw and remote writes can arrive out of order. Report saved only for the current acknowledged draft; do not equate a queued request with durable storage.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState, useEffect, useRef } from 'react';\nexport default function App(): React.JSX.Element { const [draft, setDraft] = useState(''), [saved, setSaved] = useState(''), [status, setStatus] = useState('Ready'), edited = useRef(false); useEffect(() => { if (!edited.current)\n    return; const timer = setTimeout(() => { setSaved(draft); setStatus('Saved'); }, 40); return () => clearTimeout(timer); }, [draft]); return <section><label>Draft<textarea aria-label=\"Draft\" value={draft} onChange={e => { edited.current = true; setDraft(e.target.value); setStatus('Unsaved'); }}/></label><p data-testid=\"status\">{status}</p><output data-testid=\"saved\">{saved}</output></section>; }\n",
    "architectureNotes": "Follow-up: Retry failed saves and reconcile an external edit without silently overwriting either draft.\nTopic reference: https://namastedev.com/practice/auto-save-text\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-auto-save-text. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "auto-save-text-correctness",
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
    "Retry failed saves and reconcile an external edit without silently overwriting either draft."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Rapid typing; idle save; storage failure.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "auto-save-text-variation",
      "question": "Retry failed saves and reconcile an external edit without silently overwriting either draft.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep the editable draft separate from the last acknowledged revision. Debounce writes with effect cleanup, and attach a revision to each save so a late response cannot mark newer text saved. Local storage writes can throw and remote writes can arrive out of order. Report saved only for the current acknowledged draft; do not equate a queued request with durable storage. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
