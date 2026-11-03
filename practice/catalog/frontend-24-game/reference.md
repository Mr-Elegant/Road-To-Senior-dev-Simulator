# Reference: Frontend: 24 Game

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "For a solver, recursively choose two current values, combine them with each allowed operation, and recurse on the reduced multiset. Keep the expression tree alongside each result and avoid division by zero. Use rational arithmetic for exactness or a documented tolerance for floating-point comparison. The input UI needs its own grammar if users type expressions; do not use eval.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({numbers=[1,2,3,4]}){const[value,setValue]=useState(''),[result,setResult]=useState('');function check(){try{const source=value.replace(/ /g,''),tokens=source.match(/[0-9]+|[()+*/-]/g)||[];if(!source||tokens.join('')!==source)throw new Error('Invalid expression');const used=tokens.filter(t=>/^[0-9]+$/.test(t)).map(Number).sort((a,b)=>a-b);if(JSON.stringify(used)!==JSON.stringify([...numbers].sort((a,b)=>a-b)))throw new Error('Invalid numbers');let i=0;function factor(){const token=tokens[i++];if(token==='('){const n=expr();if(tokens[i++]!==')')throw new Error('Invalid expression');return n;}if(!token||!/^[0-9]+$/.test(token))throw new Error('Invalid expression');return Number(token);}function term(){let n=factor();while(tokens[i]==='*'||tokens[i]==='/'){const op=tokens[i++],right=factor();if(op==='/'&&right===0)throw new Error('Invalid expression');n=op==='*'?n*right:n/right;}return n;}function expr(){let n=term();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],right=term();n=op==='+'?n+right:n-right;}return n;}const answer=expr();if(i!==tokens.length||!Number.isFinite(answer))throw new Error('Invalid expression');setResult(Math.abs(answer-24)<1e-9?'Correct':'Not 24');}catch(error){setResult(error.message);}}return <section><label>Expression<input aria-label=\"Expression\" value={value} onChange={e=>setValue(e.target.value)}/></label><button onClick={check}>Check</button><output data-testid=\"result\">{result}</output></section>;}",
    "architectureNotes": "Follow-up: Use exact rational pairs and canonical-state memoization to avoid repeating symmetric search branches.\nTopic reference: https://namastedev.com/practice/24-game\nThis app contract and reference were independently authored."
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
