# Reference: Frontend: Read More

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Derive the excerpt from immutable full text and store only whether it is expanded. Hide the toggle for content that already fits. Define the truncation unit, such as words, so an arbitrary UTF-16 cut does not split text unexpectedly. Keep the button label and aria-expanded aligned with the same state.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({content='',limit=3}){const[open,setOpen]=useState(false),words=content.trim()?content.trim().split(/\\s+/):[],long=words.length>limit;return <section><p data-testid=\"content\">{open||!long?content:words.slice(0,limit).join(' ')+'…'}</p>{long&&<button aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{open?'Show less':'Read more'}</button>}</section>;}",
    "architectureNotes": "Follow-up: Preserve a stable focus target and selection when switching between excerpt and full text.\nTopic reference: https://namastedev.com/practice/read-more\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "read-more-correctness",
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
    "Preserve a stable focus target and selection when switching between excerpt and full text."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Short text; exact limit; long text.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "read-more-variation",
      "question": "Preserve a stable focus target and selection when switching between excerpt and full text.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Derive the excerpt from immutable full text and store only whether it is expanded. Hide the toggle for content that already fits. Define the truncation unit, such as words, so an arbitrary UTF-16 cut does not split text unexpectedly. Keep the button label and aria-expanded aligned with the same state. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
