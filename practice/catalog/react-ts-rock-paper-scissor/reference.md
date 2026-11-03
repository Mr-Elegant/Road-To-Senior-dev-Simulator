# Reference: React + TypeScript: Rock Paper Scissor

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Generate the opponent choice in the user-action handler, then derive win/draw/loss from a small outcome table. Update the score once per committed round and store history if needed. Keep round result separate from totals. Inject the random source for tests and reject unsupported choices rather than falling through to an accidental win.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    opponent?: string;\n}\nimport { useState } from 'react';\nexport default function App({ opponent = 'rock' }: AppProps = {}): React.JSX.Element { const [result, setResult] = useState(''), [wins, setWins] = useState(0), beats: Record<string, string> = { rock: 'scissors', paper: 'rock', scissors: 'paper' }; return <section>{['rock', 'paper', 'scissors'].map(choice => <button key={choice} data-choice={choice} onClick={() => { const value = choice === opponent ? 'draw' : beats[choice] === opponent ? 'win' : 'loss'; setResult(value); if (value === 'win')\n    setWins(n => n + 1); }}>{choice}</button>)}<button data-action=\"reset\" onClick={() => { setResult(''); setWins(0); }}>Reset</button><output data-testid=\"result\">{result}</output><output data-testid=\"wins\">{wins}</output></section>; }\n",
    "architectureNotes": "Follow-up: Add best-of-N rounds with a terminal match state and an unambiguous restart action.\nTopic reference: https://namastedev.com/practice/rock-paper-scissor\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-rock-paper-scissor. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "rock-paper-scissor-correctness",
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
    "Add best-of-N rounds with a terminal match state and an unambiguous restart action."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: All nine choice pairs; repeated rounds; draw.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "rock-paper-scissor-variation",
      "question": "Add best-of-N rounds with a terminal match state and an unambiguous restart action.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Generate the opponent choice in the user-action handler, then derive win/draw/loss from a small outcome table. Update the score once per committed round and store history if needed. Keep round result separate from totals. Inject the random source for tests and reject unsupported choices rather than falling through to an accidental win. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
