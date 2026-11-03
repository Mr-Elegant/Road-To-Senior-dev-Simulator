# Reference: Frontend: Undo Redo

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Represent past, present, and future. A new committed action pushes the old present into past and clears future. Undo moves present to future and restores the last past entry; redo performs the inverse. Avoid recording transient pointer movement unless intended, and cap history or store patches when snapshots become expensive.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[history,setHistory]=useState(['']),[index,setIndex]=useState(0);function edit(value){setHistory(old=>[...old.slice(0,index+1),value]);setIndex(i=>i+1);}return <section><label>Text<input aria-label=\"Text\" value={history[index]} onChange={e=>edit(e.target.value)}/></label><button data-action=\"undo\" disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}>Undo</button><button data-action=\"redo\" disabled={index===history.length-1} onClick={()=>setIndex(i=>Math.min(history.length-1,i+1))}>Redo</button><output data-testid=\"current\">{history[index]}</output></section>;}",
    "architectureNotes": "Follow-up: Group a drag or typing burst into one undoable transaction rather than hundreds of snapshots.\nTopic reference: https://namastedev.com/practice/undo-redo\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "undo-redo-correctness",
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
    "Group a drag or typing burst into one undoable transaction rather than hundreds of snapshots."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Undo at start; redo at end; undo then new edit.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "undo-redo-variation",
      "question": "Group a drag or typing burst into one undoable transaction rather than hundreds of snapshots.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Represent past, present, and future. A new committed action pushes the old present into past and clears future. Undo moves present to future and restores the last past entry; redo performs the inverse. Avoid recording transient pointer movement unless intended, and cap history or store patches when snapshots become expensive. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
