# Reference: Frontend: Tab Switcher

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Model the active key, derive the visible content, and decide whether inactive content should remain mounted. When using the ARIA tabs pattern, pair tabs and panels and implement expected arrow-key navigation rather than adding roles cosmetically. Ordinary buttons are sufficient for a simpler section-switching contract that does not claim tabs semantics.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({items=[{id:'one',title:'One',body:'First'},{id:'two',title:'Two',body:'Second'}]}){const[id,setId]=useState(items[0]?.id);if(!items.length)return <p>No sections</p>;const selected=items.find(item=>item.id===id)||items[0];return <section>{items.map(item=><button key={item.id} data-id={item.id} aria-pressed={selected.id===item.id} onClick={()=>setId(item.id)}>{item.title}</button>)}<p data-testid=\"panel\">{selected.body}</p></section>;}",
    "architectureNotes": "Follow-up: Let URL state select a section and define how browser back/forward changes the active key.\nTopic reference: https://namastedev.com/practice/tab-switcher\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "tab-switcher-correctness",
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
    "Let URL state select a section and define how browser back/forward changes the active key."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Initial key; selected tab; invalid key fallback.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "tab-switcher-variation",
      "question": "Let URL state select a section and define how browser back/forward changes the active key.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Model the active key, derive the visible content, and decide whether inactive content should remain mounted. When using the ARIA tabs pattern, pair tabs and panels and implement expected arrow-key navigation rather than adding roles cosmetically. Ordinary buttons are sufficient for a simpler section-switching contract that does not claim tabs semantics. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
