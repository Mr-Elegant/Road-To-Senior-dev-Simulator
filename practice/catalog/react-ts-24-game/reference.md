# Reference: React + TypeScript: 24 Game

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "For a solver, recursively choose two current values, combine them with each allowed operation, and recurse on the reduced multiset. Keep the expression tree alongside each result and avoid division by zero. Use rational arithmetic for exactness or a documented tolerance for floating-point comparison. The input UI needs its own grammar if users type expressions; do not use eval.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    numbers?: (number)[];\n}\nimport { useState } from 'react';\nexport default function App({ numbers = [1, 2, 3, 4] }: AppProps = {}): React.JSX.Element { const [value, setValue] = useState(''), [result, setResult] = useState(''); function check() { try {\n    const source = value.replace(/ /g, ''), tokens = source.match(/[0-9]+|[()+*/-]/g) || [];\n    if (!source || tokens.join('') !== source)\n        throw new Error('Invalid expression');\n    const used = tokens.filter(t => /^[0-9]+$/.test(t)).map(Number).sort((a, b) => a - b);\n    if (JSON.stringify(used) !== JSON.stringify([...numbers].sort((a, b) => a - b)))\n        throw new Error('Invalid numbers');\n    let i = 0;\n    function factor(): number { const token = tokens[i++]; if (token === '(') {\n        const n = expr();\n        if (tokens[i++] !== ')')\n            throw new Error('Invalid expression');\n        return n;\n    } if (!token || !/^[0-9]+$/.test(token))\n        throw new Error('Invalid expression'); return Number(token); }\n    function term(): number { let n = factor(); while (tokens[i] === '*' || tokens[i] === '/') {\n        const op = tokens[i++], right = factor();\n        if (op === '/' && right === 0)\n            throw new Error('Invalid expression');\n        n = op === '*' ? n * right : n / right;\n    } return n; }\n    function expr(): number { let n = term(); while (tokens[i] === '+' || tokens[i] === '-') {\n        const op = tokens[i++], right = term();\n        n = op === '+' ? n + right : n - right;\n    } return n; }\n    const answer = expr();\n    if (i !== tokens.length || !Number.isFinite(answer))\n        throw new Error('Invalid expression');\n    setResult(Math.abs(answer - 24) < 1e-9 ? 'Correct' : 'Not 24');\n}\ncatch (error) {\n    setResult((error instanceof Error ? error.message : String(error)));\n} } return <section><label>Expression<input aria-label=\"Expression\" value={value} onChange={e => setValue(e.target.value)}/></label><button onClick={check}>Check</button><output data-testid=\"result\">{result}</output></section>; }\n",
    "architectureNotes": "Follow-up: Use exact rational pairs and canonical-state memoization to avoid repeating symmetric search branches.\nTopic reference: https://namastedev.com/practice/24-game\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-24-game. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "24-game-correctness",
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
    "Use exact rational pairs and canonical-state memoization to avoid repeating symmetric search branches."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Repeated numbers; fractional intermediate values; zero denominator.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "24-game-variation",
      "question": "Use exact rational pairs and canonical-state memoization to avoid repeating symmetric search branches.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "For a solver, recursively choose two current values, combine them with each allowed operation, and recurse on the reduced multiset. Keep the expression tree alongside each result and avoid division by zero. Use rational arithmetic for exactness or a documented tolerance for floating-point comparison. The input UI needs its own grammar if users type expressions; do not use eval. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
