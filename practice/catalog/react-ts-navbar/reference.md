# Reference: React + TypeScript: Navbar

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use nav and ordinary links for page navigation. Use a button for the mobile disclosure, expose aria-expanded and aria-controls, and close it after navigation or Escape. Mark the current page with aria-current rather than relying only on color. Avoid role=menu unless implementing that complete keyboard interaction model.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    current?: string;\n}\nimport { useState } from 'react';\nexport default function App({ current = 'home' }: AppProps = {}): React.JSX.Element { const [open, setOpen] = useState(false); return <header><button aria-controls=\"site-nav\" aria-expanded={open} onClick={() => setOpen(v => !v)} onKeyDown={e => { if (e.key === 'Escape')\n    setOpen(false); }}>Menu</button>{open && <nav id=\"site-nav\" aria-label=\"Site\">{['home', 'about'].map(id => <a key={id} href={'#' + id} aria-current={current === id ? 'page' : undefined} onClick={() => setOpen(false)}>{id === 'home' ? 'Home' : 'About'}</a>)}</nav>}</header>; }\n",
    "architectureNotes": "Follow-up: Handle focus restoration when a mobile drawer closes after an in-app route change.\nTopic reference: https://namastedev.com/practice/navbar\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-navbar. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "navbar-correctness",
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
    "Handle focus restoration when a mobile drawer closes after an in-app route change."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Current route; mobile open/close; Escape.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "navbar-variation",
      "question": "Handle focus restoration when a mobile drawer closes after an in-app route change.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use nav and ordinary links for page navigation. Use a button for the mobile disclosure, expose aria-expanded and aria-controls, and close it after navigation or Escape. Mark the current page with aria-current rather than relying only on color. Avoid role=menu unless implementing that complete keyboard interaction model. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
