# Reference: React + TypeScript: Nested Comments

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Normalize comments by ID with parent IDs and ordered child lists, or use a carefully immutable tree. Keep editing drafts local to the chosen ID and avoid recursive index keys. Define deletion as subtree removal or a tombstone that preserves replies. Sanitize any supported rich content and derive displayed authors from trusted server records. Deep threads need bounded rendering and accessible reply context.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n}\nimport { useState, useRef } from 'react';\nexport default function App(): React.JSX.Element { const [comments, setComments] = useState<{\n    id: string;\n    text: string;\n    parent: string | null;\n    deleted: boolean;\n}[]>([{ id: '1', text: 'Root', parent: null, deleted: false }]), [draft, setDraft] = useState(''), [parent, setParent] = useState<string | null>(null), next = useRef(2); function add() { if (!draft.trim())\n    return; const id = String(next.current++); setComments(old => [...old, { id, text: draft.trim(), parent, deleted: false }]); setDraft(''); setParent(null); } function render(p: string | null): React.JSX.Element { return <ul>{comments.filter(c => c.parent === p).map(c => <li key={c.id} data-comment={c.id}><span data-text={c.id}>{c.deleted ? '[deleted]' : c.text}</span><button data-reply={c.id} disabled={c.deleted} onClick={() => setParent(c.id)}>Reply</button><button data-delete={c.id} onClick={() => setComments(old => old.map(item => item.id === c.id ? { ...item, deleted: true } : item))}>Delete</button>{render(c.id)}</li>)}</ul>; } return <section><label>Text<input aria-label=\"Text\" value={draft} onChange={e => setDraft(e.target.value)}/></label><button data-action=\"add\" onClick={add}>Add</button>{render(null)}</section>; }\n",
    "architectureNotes": "Follow-up: Add optimistic replies with temporary IDs and reconcile server acknowledgements without duplicating the thread.\nTopic reference: https://namastedev.com/practice/nested-comments\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-nested-comments. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "nested-comments-correctness",
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
    "Add optimistic replies with temporary IDs and reconcile server acknowledgements without duplicating the thread."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Reply to deleted comment; deep nesting; duplicate text.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "nested-comments-variation",
      "question": "Add optimistic replies with temporary IDs and reconcile server acknowledgements without duplicating the thread.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Normalize comments by ID with parent IDs and ordered child lists, or use a carefully immutable tree. Keep editing drafts local to the chosen ID and avoid recursive index keys. Define deletion as subtree removal or a tombstone that preserves replies. Sanitize any supported rich content and derive displayed authors from trusted server records. Deep threads need bounded rendering and accessible reply context. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
