# Reference: React UI: Project Completion Meter

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "A single normalized integer drives the entire presentation. Strict numeric validation avoids surprising coercion of strings and null; clamping before rounding keeps the result inside the ARIA range. The component derives its output directly from current props, so a parent update naturally refreshes the value without an effect.",
    "codeOrArtifact": "export default function App({ value = 0 }) {\n  const progress = typeof value === 'number' && Number.isFinite(value) ? Math.round(Math.max(0, Math.min(100, value))) : 0;\n  return <section><div role=\"progressbar\" aria-label=\"Project completion\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow={progress} style={{background:'#e4e4e7', height:16}}>\n    <div style={{background:'#2563eb', height:'100%', width:progress + '%'}} /></div>\n    <output data-testid=\"percentage\">{progress}%</output></section>;\n}"
  },
  "rubric": [
    {
      "id": "react-ui-project-progress-behavior",
      "category": "correctness",
      "label": "Component behavior and boundaries",
      "weight": 5,
      "description": "Use test evidence to explain state transitions, accessible controls, and boundary behavior.",
      "levels": [
        {
          "score": 0,
          "description": "The component is missing or its main interaction fails."
        },
        {
          "score": 1,
          "description": "The happy path works but boundary cases fail."
        },
        {
          "score": 2,
          "description": "All authored cases pass; additional accessibility or edge-case reasoning is incomplete."
        },
        {
          "score": 3,
          "description": "All authored cases pass and the implementation and limitations are explained."
        }
      ]
    }
  ],
  "alternatives": [
    "Extract a small pure helper for derived values; keep input state in the component. Extend with a custom hook only when behavior is reused."
  ],
  "commonMistakes": [
    "Coercing numeric strings even though the input contract forbids them.",
    "Updating the text but leaving an inconsistent aria-valuenow."
  ],
  "followUps": [
    {
      "id": "progress-follow",
      "question": "What if the total work is unknown?",
      "expectedConcepts": [
        "Indeterminate progress",
        "ARIA"
      ],
      "sampleStrongAnswer": "Use an indeterminate presentation and omit aria-valuenow while retaining an accessible name. Do not show a fabricated percentage. When a denominator becomes available, switch to a determinate value."
    }
  ]
}
```
