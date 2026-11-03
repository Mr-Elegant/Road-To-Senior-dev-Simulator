# Reference: React + TypeScript: Searchable Dropdown

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Separate input query, highlighted option, selected value, and popup visibility. Use stable option IDs and reconcile the highlight when matches change. Follow combobox/listbox semantics with aria-expanded, aria-controls, and aria-activedescendant as appropriate. Enter commits the highlighted eligible option, while Escape closes without an accidental value change.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    options?: (string)[];\n}\nimport { useState } from 'react';\nexport default function App({ options = ['Apple', 'Banana', 'Cherry'] }: AppProps = {}): React.JSX.Element { const [query, setQuery] = useState(''), [open, setOpen] = useState(false), [selected, setSelected] = useState<string[]>([]), [active, setActive] = useState(0); const multi = false, matches = options.filter(value => value.toLowerCase().includes(query.trim().toLowerCase())); function choose(value: string) { setSelected(old => multi ? (old.includes(value) ? old.filter(v => v !== value) : [...old, value]) : [value]); if (!multi) {\n    setQuery(value);\n    setOpen(false);\n} } return <section><label>Search options<input aria-label=\"Search options\" role=\"combobox\" aria-expanded={open} aria-controls=\"choices\" aria-activedescendant={open && matches.length ? 'choice-' + Math.min(active, matches.length - 1) : undefined} value={query} onChange={e => { setQuery(e.target.value); setOpen(true); setActive(0); }} onKeyDown={e => { if (e.key === 'Escape')\n    setOpen(false); if (e.key === 'ArrowDown') {\n    e.preventDefault();\n    setOpen(true);\n    setActive(n => Math.min(matches.length - 1, n + 1));\n} if (e.key === 'Enter' && open && matches.length) {\n    e.preventDefault();\n    choose(matches[Math.max(0, Math.min(active, matches.length - 1))]);\n} }}/></label>{open && <ul id=\"choices\" role=\"listbox\" aria-multiselectable={multi}>{matches.map((value, i) => <li key={value}><button id={'choice-' + i} role=\"option\" aria-selected={selected.includes(value)} onClick={() => choose(value)}>{value}</button></li>)}{!matches.length && <li>No options</li>}</ul>}<output data-testid=\"selected\">{selected.join(',')}</output></section>; }\n",
    "architectureNotes": "Follow-up: Fetch suggestions asynchronously and prevent an older response from replacing newer matches.\nTopic reference: https://namastedev.com/practice/searchable-dropdown\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-searchable-dropdown. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "searchable-dropdown-correctness",
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
    "Fetch suggestions asynchronously and prevent an older response from replacing newer matches."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: No results; arrow navigation; disabled option.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "searchable-dropdown-variation",
      "question": "Fetch suggestions asynchronously and prevent an older response from replacing newer matches.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Separate input query, highlighted option, selected value, and popup visibility. Use stable option IDs and reconcile the highlight when matches change. Follow combobox/listbox semantics with aria-expanded, aria-controls, and aria-activedescendant as appropriate. Enter commits the highlighted eligible option, while Escape closes without an accidental value change. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
