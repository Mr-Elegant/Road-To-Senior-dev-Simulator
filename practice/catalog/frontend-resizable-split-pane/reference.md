# Reference: Frontend: Resizable Split Pane

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Track the split as one value and clamp it against the container’s measured size and minimum pane widths. Use pointer capture for a drag so leaving the divider does not lose the interaction. A focusable separator needs orientation and value attributes plus arrow-key controls. Clean up observers/listeners and recalculate bounds when the container resizes.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[n,setN]=useState(50);return <section><label>Left pane width<input aria-label=\"Left pane width\" type=\"range\" min=\"20\" max=\"80\" value={n} onChange={e=>setN(Math.max(20,Math.min(80,Number(e.target.value))))}/></label><div style={{display:'flex'}}><div data-testid=\"left\" style={{width:n+'%'}}>Left</div><div data-testid=\"right\" style={{width:(100-n)+'%'}}>Right</div></div><output data-testid=\"ratio\">{n+'/'+(100-n)}</output></section>;}",
    "architectureNotes": "Follow-up: Persist the ratio rather than raw pixels and restore it safely on a narrower device.\nTopic reference: https://namastedev.com/practice/resizable-split-pane\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "resizable-split-pane-correctness",
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
    "Persist the ratio rather than raw pixels and restore it safely on a narrower device."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Minimum/maximum sizes; pointer leaves handle; pointer cancellation.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "resizable-split-pane-variation",
      "question": "Persist the ratio rather than raw pixels and restore it safely on a narrower device.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Track the split as one value and clamp it against the container’s measured size and minimum pane widths. Use pointer capture for a drag so leaving the divider does not lose the interaction. A focusable separator needs orientation and value attributes plus arrow-key controls. Clean up observers/listeners and recalculate bounds when the container resizes. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
