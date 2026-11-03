# Reference: Frontend: Generate Password

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use a cryptographic random source and unbiased bounded sampling. If each selected class must appear, satisfy that constraint explicitly and shuffle the final characters without bias. Reject impossible configurations, such as too few positions for required classes. Keep the generated secret local and avoid logging it; a generated password still needs safe user handling.",
    "codeOrArtifact": "import {useState,useRef} from 'react';export default function App({draws}){const[length,setLength]=useState('8'),[password,setPassword]=useState(''),[error,setError]=useState(''),cursor=useRef(0);function index(bound){if(draws)return Math.floor((draws[cursor.current++%draws.length]??0)*bound);const values=new Uint32Array(1),max=Math.floor(4294967296/bound)*bound;do{crypto.getRandomValues(values);}while(values[0]>=max);return values[0]%bound;}function generate(){const n=Number(length);if(!length.trim()||!Number.isInteger(n)||n<4||n>32){setPassword('');setError('Invalid length');return;}const groups=['ab','AB','01','!'],all=groups.join(''),chars=groups.map(group=>group[index(group.length)]);while(chars.length<n)chars.push(all[index(all.length)]);for(let i=chars.length-1;i>0;i--){const j=index(i+1);[chars[i],chars[j]]=[chars[j],chars[i]];}setPassword(chars.join(''));setError('');}return <section><label>Length<input aria-label=\"Length\" value={length} onChange={e=>setLength(e.target.value)}/></label><button onClick={generate}>Generate</button><output data-testid=\"password\" data-length={password.length}>{password}</output><p role=\"alert\">{error}</p></section>;}",
    "architectureNotes": "Follow-up: Explain rejection sampling and why modulo reduction can bias a character distribution.\nTopic reference: https://namastedev.com/practice/generate-password\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "generate-password-correctness",
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
    "Explain rejection sampling and why modulo reduction can bias a character distribution."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: No classes; invalid length; class coverage.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "generate-password-variation",
      "question": "Explain rejection sampling and why modulo reduction can bias a character distribution.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use a cryptographic random source and unbiased bounded sampling. If each selected class must appear, satisfy that constraint explicitly and shuffle the final characters without bias. Reject impossible configurations, such as too few positions for required classes. Keep the generated secret local and avoid logging it; a generated password still needs safe user handling. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
