# Reference: React + TypeScript: Emoji Replacer

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Choose exact token boundaries and a deterministic mapping. Scan once or use an escaped alternation ordered to avoid partial overlapping matches. Keep input text as text, not injected HTML. If replacement is performed inside an editor, preserving selection and composition is a separate requirement; a derived preview is much simpler.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nexport default function App(): React.JSX.Element { const [value, setValue] = useState(''); const map: Record<string, string> = { ':smile:': '😀', ':heart:': '❤️', ':fire:': '🔥' }; return <section><label>Message<textarea aria-label=\"Message\" value={value} onChange={e => setValue(e.target.value)}/></label><p data-testid=\"preview\">{value.replace(/:smile:|:heart:|:fire:/g, token => map[token])}</p></section>; }\n",
    "architectureNotes": "Follow-up: Implement an editable rich-text version and explain caret mapping across replacements.\nTopic reference: https://namastedev.com/practice/emoji-replacer\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-emoji-replacer. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "emoji-replacer-correctness",
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
    "Implement an editable rich-text version and explain caret mapping across replacements."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Adjacent tokens; unknown token; overlapping names.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "emoji-replacer-variation",
      "question": "Implement an editable rich-text version and explain caret mapping across replacements.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Choose exact token boundaries and a deterministic mapping. Scan once or use an escaped alternation ordered to avoid partial overlapping matches. Keep input text as text, not injected HTML. If replacement is performed inside an editor, preserving selection and composition is a separate requirement; a derived preview is much simpler. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
