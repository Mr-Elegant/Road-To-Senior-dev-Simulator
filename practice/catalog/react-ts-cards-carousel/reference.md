# Reference: React + TypeScript: Cards Carousel

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Track a start index and derive the visible slice from item count and measured cards-per-view. The maximum start is max(0,total-visible), not total-1. Reconcile the index when the viewport or data changes. Keep card identities stable and ensure offscreen interactive elements are not accidentally reachable if the chosen implementation hides them.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    items?: (string)[];\n}\nimport { useState, useRef } from 'react';\nexport default function App({ items = ['Alpha', 'Beta', 'Gamma'] }: AppProps = {}): React.JSX.Element { const [index, setIndex] = useState(0), dialog = useRef<HTMLDialogElement>(null); let kind: string = \"cards\", slots = kind === 'cards' ? 2 : 1, max = Math.max(0, items.length - slots); if (!items.length)\n    return <p>No images</p>; const position = Math.min(index, max); function move(delta: number) { setIndex(i => kind === 'image' ? (i + delta + items.length) % items.length : Math.max(0, Math.min(max, i + delta))); } return <section>{kind === 'gallery' && items.map((title, i) => <button key={i} data-thumbnail={i} onClick={() => { setIndex(i); dialog.current?.showModal(); }}>{title}</button>)}<div data-testid=\"slides\">{items.slice(position, position + slots).map(title => <article key={title}><img alt={title} src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==\"/><h2>{title}</h2></article>)}</div><button data-action=\"previous\" onClick={() => move(-1)}>Previous</button><button data-action=\"next\" onClick={() => move(1)}>Next</button>{kind === 'gallery' && <dialog ref={dialog} aria-label=\"Image viewer\"><h2 data-testid=\"viewer\">{items[index]}</h2><button data-action=\"close\" onClick={() => dialog.current?.close()}>Close viewer</button></dialog>}</section>; }\n",
    "architectureNotes": "Follow-up: Add virtualized card rendering and preserve focus when a previously visible card moves offscreen.\nTopic reference: https://namastedev.com/practice/cards-carousel\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-cards-carousel. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "cards-carousel-correctness",
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
    "Add virtualized card rendering and preserve focus when a previously visible card moves offscreen."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Fewer items than slots; final partial group; resize.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "cards-carousel-variation",
      "question": "Add virtualized card rendering and preserve focus when a previously visible card moves offscreen.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Track a start index and derive the visible slice from item count and measured cards-per-view. The maximum start is max(0,total-visible), not total-1. Reconcile the index when the viewport or data changes. Keep card identities stable and ensure offscreen interactive elements are not accidentally reachable if the chosen implementation hides them. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
