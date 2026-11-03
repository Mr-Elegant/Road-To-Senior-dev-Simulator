# Reference: Frontend: Calculator

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Tokenize a documented grammar and parse operator precedence with a stack or parser. Alternatively model button entry as an explicit accumulator/operator state machine for a simpler calculator. Define unary minus, decimal entry, division by zero, and repeated equals behavior. Arbitrary eval is not a parser and creates both correctness and injection problems.",
    "codeOrArtifact": "import { useState } from 'react';\nconst compute = (function compute(f) { const match = f.Expression.trim().match(/^(-?(?:\\d+(?:\\.\\d*)?|\\.\\d+))\\s*([+*\\/\\-])\\s*(-?(?:\\d+(?:\\.\\d*)?|\\.\\d+))$/); if (!match)\n        throw new Error('Invalid expression'); const a = Number(match[1]), b = Number(match[3]); if (!Number.isFinite(a) || !Number.isFinite(b) || match[2] === '/' && b === 0)\n        throw new Error('Invalid expression'); return match[2] === '+' ? a + b : match[2] === '-' ? a - b : match[2] === '*' ? a * b : a / b; });\nexport default function App() {\n  const [fields, setFields] = useState({\"Expression\":\"\"});\n  const [result, setResult] = useState('');\n  const [error, setError] = useState('');\n  function submit(event) { event.preventDefault(); try { const value = compute(fields); setResult(JSON.stringify(value)); setError(''); } catch (reason) { setResult(''); setError(reason.message); } }\n  return <form onSubmit={submit}>{[\"Expression\"].map(name => <label key={name}>{name}{name==='Text'||name==='JSON'?<textarea aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>:<input aria-label={name} name={name} value={fields[name]} onChange={event => setFields(old => ({...old,[name]:event.target.value}))}/>}</label>)}\n    <button type=\"submit\">Calculate</button><output data-testid=\"result\">{result}</output><p role=\"alert\" data-testid=\"error\">{error}</p></form>;\n}",
    "architectureNotes": "Follow-up: Add parentheses with a real grammar and separate numeric precision policy from input parsing.\nTopic reference: https://namastedev.com/practice/calculator\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "calculator-correctness",
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
    "Add parentheses with a real grammar and separate numeric precision policy from input parsing."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Operator precedence; unary minus; decimal input.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "calculator-variation",
      "question": "Add parentheses with a real grammar and separate numeric precision policy from input parsing.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Tokenize a documented grammar and parse operator precedence with a stack or parser. Alternatively model button entry as an explicit accumulator/operator state machine for a simpler calculator. Define unary minus, decimal entry, division by zero, and repeated equals behavior. Arbitrary eval is not a parser and creates both correctness and injection problems. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
