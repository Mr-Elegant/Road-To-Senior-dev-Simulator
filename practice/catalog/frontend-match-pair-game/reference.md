# Reference: Frontend: Match Pair Game

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Represent cards by stable pair IDs and card-instance IDs. Track revealed unmatched cards, permanently matched pairs, and an explicit resolving state. Ignore clicks on a matched/already revealed card and block a third reveal during the delay. Clear the mismatch timer on restart or unmount so an old round cannot modify the new board. Inject shuffle randomness for tests.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[open,setOpen]=useState([]),[matched,setMatched]=useState([]),[pending,setPending]=useState(false),pairs=['A','B','A','B'];function flip(id){if(pending||open.includes(id)||matched.includes(id))return;const next=[...open,id];if(next.length===2){if(pairs[next[0]]===pairs[next[1]]){setMatched(old=>[...old,...next]);setOpen([]);}else{setOpen(next);setPending(true);}}else setOpen(next);}return <section>{pairs.map((pair,id)=><button key={id} data-card={id} onClick={()=>flip(id)}>{open.includes(id)||matched.includes(id)?pair:'?'}</button>)}<button data-action=\"resolve\" onClick={()=>{if(pending){setOpen([]);setPending(false);}}}>Resolve</button><button data-action=\"restart\" onClick={()=>{setOpen([]);setMatched([]);setPending(false);}}>Restart</button><output data-testid=\"matched\">{matched.length}</output></section>;}",
    "architectureNotes": "Follow-up: Add a reduced-motion mode and an accessible announcement strategy that preserves the puzzle’s rules.\nTopic reference: https://namastedev.com/practice/match-pair-game\nThis app contract and reference were independently authored."
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
