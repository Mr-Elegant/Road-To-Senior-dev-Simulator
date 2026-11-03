# Reference: Frontend: Kanban Board

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Normalize cards by ID and store ordered ID lists per column, or use an equivalent explicit reducer. A move must remove the card from its source and insert it once into the target as one state transition. Keep drag presentation separate from committed order. Provide a keyboard or button-based move path instead of making drag the only interaction.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[cards,setCards]=useState([{id:'A',column:'todo'},{id:'B',column:'todo'}]),[dragged,setDragged]=useState(null),columns=['todo','doing','done'];function move(id,column){setCards(old=>old.map(card=>card.id===id?{...card,column}:card));}return <section>{columns.map(column=><div key={column} data-column={column} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();move(dragged,column);setDragged(null);}}><h2>{column}</h2>{cards.filter(c=>c.column===column).map(card=><article key={card.id} data-card={card.id} draggable onDragStart={()=>setDragged(card.id)}>{card.id}<button data-move={card.id} onClick={()=>move(card.id,columns[Math.min(2,columns.indexOf(column)+1)])}>Move {card.id}</button></article>)}</div>)}<output data-testid=\"counts\">{columns.map(column=>cards.filter(c=>c.column===column).length).join(',')}</output></section>;}",
    "architectureNotes": "Follow-up: Add optimistic server persistence with version conflicts and rollback that preserves newer actions.\nTopic reference: https://namastedev.com/practice/kanban-board\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "kanban-board-correctness",
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
    "Add optimistic server persistence with version conflicts and rollback that preserves newer actions."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Same-column reorder; cross-column move; empty destination.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "kanban-board-variation",
      "question": "Add optimistic server persistence with version conflicts and rollback that preserves newer actions.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Normalize cards by ID and store ordered ID lists per column, or use an equivalent explicit reducer. A move must remove the card from its source and insert it once into the target as one state transition. Keep drag presentation separate from committed order. Provide a keyboard or button-based move path instead of making drag the only interaction. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
