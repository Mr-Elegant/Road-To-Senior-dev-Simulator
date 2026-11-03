# Reference: React + TypeScript: Sidebar

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Keep collapsed state separate from current-route state. Use a named nav landmark, native links, an explicit toggle button, and a visible focus indicator. If collapsed labels are hidden, preserve accessible link names. For a modal mobile drawer, make background interaction inert and restore focus when it closes; desktop navigation need not trap focus.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState } from 'react';\nexport default function App(): React.JSX.Element { const [open, setOpen] = useState(true); return <aside><button aria-label=\"Toggle sidebar\" aria-controls=\"workspace-nav\" aria-expanded={open} onClick={() => setOpen(v => !v)} onKeyDown={e => { if (e.key === 'Escape')\n    setOpen(false); }}>Toggle sidebar</button>{open && <nav id=\"workspace-nav\" aria-label=\"Workspace\"><a href=\"#dashboard\">Dashboard</a><a href=\"#reports\">Reports</a></nav>}</aside>; }\n",
    "architectureNotes": "Follow-up: Persist only the layout preference and distinguish desktop collapse from mobile open state.\nTopic reference: https://namastedev.com/practice/sidebar\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-sidebar. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "sidebar-correctness",
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
    "Persist only the layout preference and distinguish desktop collapse from mobile open state."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Collapse/expand; active route; mobile Escape.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "sidebar-variation",
      "question": "Persist only the layout preference and distinguish desktop collapse from mobile open state.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Keep collapsed state separate from current-route state. Use a named nav landmark, native links, an explicit toggle button, and a visible focus indicator. If collapsed labels are hidden, preserve accessible link names. For a modal mobile drawer, make background interaction inert and restore focus when it closes; desktop navigation need not trap focus. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
