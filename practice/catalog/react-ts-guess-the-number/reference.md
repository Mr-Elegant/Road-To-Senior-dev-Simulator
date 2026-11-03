# Reference: React + TypeScript: Guess the number

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Create the secret at round initialization rather than on every render. Store guesses and round status; derive high/low/correct feedback from a validated integer. Specify whether invalid guesses consume attempts and enforce that rule consistently. Disable guessing when a round ends and create a new secret only on restart. Inject randomness for deterministic tests.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    secret?: number;\n}\nimport { useState } from 'react';\nexport default function App({ secret = 42 }: AppProps = {}): React.JSX.Element { const [value, setValue] = useState(''), [feedback, setFeedback] = useState(''), [won, setWon] = useState(false); function guess() { if (won)\n    return; const n = Number(value); if (!value.trim() || !Number.isInteger(n) || n < 1 || n > 100) {\n    setFeedback('Invalid guess');\n    return;\n} setFeedback(n === secret ? 'Correct' : n < secret ? 'Too low' : 'Too high'); if (n === secret)\n    setWon(true); } return <section><label>Guess<input aria-label=\"Guess\" value={value} onChange={e => setValue(e.target.value)}/></label><button data-action=\"guess\" onClick={guess}>Guess</button><button data-action=\"restart\" onClick={() => { setValue(''); setFeedback(''); setWon(false); }}>Restart</button><p data-testid=\"feedback\">{feedback}</p></section>; }\n",
    "architectureNotes": "Follow-up: Add a reproducible seed and a history view without leaking the secret into normal UI state displays.\nTopic reference: https://namastedev.com/practice/guess-the-number\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-guess-the-number. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "guess-the-number-correctness",
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
    "Add a reproducible seed and a history view without leaking the secret into normal UI state displays."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Bounds; non-integer input; repeat guess.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "guess-the-number-variation",
      "question": "Add a reproducible seed and a history view without leaking the secret into normal UI state displays.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Create the secret at round initialization rather than on every render. Store guesses and round status; derive high/low/correct feedback from a validated integer. Specify whether invalid guesses consume attempts and enforce that rule consistently. Disable guessing when a round ends and create a new secret only on restart. Inject randomness for deterministic tests. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
