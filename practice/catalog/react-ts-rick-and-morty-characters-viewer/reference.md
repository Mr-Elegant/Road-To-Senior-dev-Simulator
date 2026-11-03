# Reference: React + TypeScript: Rick And Morty Characters Viewer

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Treat the external API as a replaceable data source with a documented response adapter. Key requests by search/filter/page, cancel or ignore stale responses, and distinguish loading, no matches, unavailable service, and malformed data. Do not assume a sample API is always online or that page totals stay stable. Preserve user controls and give errors a retry action.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    pages?: ((string)[])[];\n    failPage?: number;\n}\nimport { useState } from 'react';\nexport default function App({ pages = [['Ada'], ['Lin']], failPage = -1 }: AppProps = {}): React.JSX.Element { const [page, setPage] = useState(0), [rows, setRows] = useState(pages[0] || []), [status, setStatus] = useState('Ready'); async function load(next: number) { setPage(next); setStatus('Loading'); await Promise.resolve(); if (next === failPage) {\n    setRows([]);\n    setStatus('Unable to load');\n}\nelse {\n    setRows(pages[next] || []);\n    setStatus('Ready');\n} } return <section><ul>{rows.map(name => <li key={name}>{name}</li>)}</ul><button data-action=\"previous\" disabled={page === 0} onClick={() => load(Math.max(0, page - 1))}>Previous</button><button data-action=\"next\" disabled={page >= pages.length - 1} onClick={() => load(Math.min(pages.length - 1, page + 1))}>Next</button><p data-testid=\"status\">{status}</p></section>; }\n",
    "architectureNotes": "Follow-up: Add a cache with explicit freshness rules and avoid replaying cached data from a different query.\nTopic reference: https://namastedev.com/practice/rick-and-morty-characters-viewer\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-rick-and-morty-characters-viewer. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "rick-and-morty-characters-viewer-correctness",
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
    "Add a cache with explicit freshness rules and avoid replaying cached data from a different query."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: No matches; fetch failure; out-of-order response.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "rick-and-morty-characters-viewer-variation",
      "question": "Add a cache with explicit freshness rules and avoid replaying cached data from a different query.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Treat the external API as a replaceable data source with a documented response adapter. Key requests by search/filter/page, cancel or ignore stale responses, and distinguish loading, no matches, unavailable service, and malformed data. Do not assume a sample API is always online or that page totals stay stable. Preserve user controls and give errors a retry action. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
