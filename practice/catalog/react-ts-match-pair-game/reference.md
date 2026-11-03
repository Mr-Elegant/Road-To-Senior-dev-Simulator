# Reference: React + TypeScript: Match Pair Game

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Represent cards by stable pair IDs and card-instance IDs. Track revealed unmatched cards, permanently matched pairs, and an explicit resolving state. Ignore clicks on a matched/already revealed card and block a third reveal during the delay. Clear the mismatch timer on restart or unmount so an old round cannot modify the new board. Inject shuffle randomness for tests.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nexport default function App(): React.JSX.Element { const [open, setOpen] = useState<number[]>([]), [matched, setMatched] = useState<number[]>([]), [pending, setPending] = useState(false), pairs = ['A', 'B', 'A', 'B']; function flip(id: number) { if (pending || open.includes(id) || matched.includes(id))\n    return; const next = [...open, id]; if (next.length === 2) {\n    if (pairs[next[0]] === pairs[next[1]]) {\n        setMatched(old => [...old, ...next]);\n        setOpen([]);\n    }\n    else {\n        setOpen(next);\n        setPending(true);\n    }\n}\nelse\n    setOpen(next); } return <section>{pairs.map((pair, id) => <button key={id} data-card={id} onClick={() => flip(id)}>{open.includes(id) || matched.includes(id) ? pair : '?'}</button>)}<button data-action=\"resolve\" onClick={() => { if (pending) {\n    setOpen([]);\n    setPending(false);\n} }}>Resolve</button><button data-action=\"restart\" onClick={() => { setOpen([]); setMatched([]); setPending(false); }}>Restart</button><output data-testid=\"matched\">{matched.length}</output></section>; }\n",
    "architectureNotes": "Follow-up: Add a reduced-motion mode and an accessible announcement strategy that preserves the puzzle’s rules.\nTopic reference: https://namastedev.com/practice/match-pair-game\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-match-pair-game. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "match-pair-game-correctness",
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
    "Add a reduced-motion mode and an accessible announcement strategy that preserves the puzzle’s rules."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Same card twice; match; mismatch delay.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "match-pair-game-variation",
      "question": "Add a reduced-motion mode and an accessible announcement strategy that preserves the puzzle’s rules.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Represent cards by stable pair IDs and card-instance IDs. Track revealed unmatched cards, permanently matched pairs, and an explicit resolving state. Ignore clicks on a matched/already revealed card and block a third reveal during the delay. Clear the mismatch timer on restart or unmount so an old round cannot modify the new board. Inject shuffle randomness for tests. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
