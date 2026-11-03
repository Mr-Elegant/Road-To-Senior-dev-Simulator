# Reference: Frontend: Holy Grail

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use CSS Grid to express the desktop areas and a minmax(0,1fr) content track to allow internal overflow. Preserve a sensible DOM reading order rather than visually rearranging essential content into a confusing tab order. At narrow widths stack the secondary regions or provide intentional disclosures. Avoid fixed content heights that clip long text.",
    "codeOrArtifact": "export default function App(){return <div className=\"layout\"><style>{'.layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr) minmax(0,1fr);gap:8px}.layout header,.layout footer{grid-column:1/-1}.layout main{min-width:0}@media(max-width:600px){.layout{grid-template-columns:minmax(0,1fr)}}'}</style><header>Header</header><nav>Navigation</nav><main>Content</main><aside>Related</aside><footer>Footer</footer></div>;}",
    "architectureNotes": "Follow-up: Make the main region independently scrollable without trapping browser navigation or hiding the footer.\nTopic reference: https://namastedev.com/practice/holy-grail\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "holy-grail-correctness",
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
    "Make the main region independently scrollable without trapping browser navigation or hiding the footer."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: 320px viewport; long code block; missing aside.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "holy-grail-variation",
      "question": "Make the main region independently scrollable without trapping browser navigation or hiding the footer.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use CSS Grid to express the desktop areas and a minmax(0,1fr) content track to allow internal overflow. Preserve a sensible DOM reading order rather than visually rearranging essential content into a confusing tab order. At narrow widths stack the secondary regions or provide intentional disclosures. Avoid fixed content heights that clip long text. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
