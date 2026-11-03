# Reference: React + TypeScript: Multiselect dropdown

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store selection by option ID and keep query/highlight state separate. Expose a properly implemented multiselect listbox or checkbox-based popup with accessible names. Search changes the view, not the selection. Define clear-all, disabled-option, and maximum-selection rules, and provide keyboard ways to add and remove selections.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    options?: (string)[];\n}\nimport { useState } from 'react';\nexport default function App({ options = ['Apple', 'Banana', 'Cherry'] }: AppProps = {}): React.JSX.Element { const [query, setQuery] = useState(''), [open, setOpen] = useState(false), [selected, setSelected] = useState<string[]>([]), [active, setActive] = useState(0); const multi = true, matches = options.filter(value => value.toLowerCase().includes(query.trim().toLowerCase())); function choose(value: string) { setSelected(old => multi ? (old.includes(value) ? old.filter(v => v !== value) : [...old, value]) : [value]); if (!multi) {\n    setQuery(value);\n    setOpen(false);\n} } return <section><label>Search options<input aria-label=\"Search options\" role=\"combobox\" aria-expanded={open} aria-controls=\"choices\" aria-activedescendant={open && matches.length ? 'choice-' + Math.min(active, matches.length - 1) : undefined} value={query} onChange={e => { setQuery(e.target.value); setOpen(true); setActive(0); }} onKeyDown={e => { if (e.key === 'Escape')\n    setOpen(false); if (e.key === 'ArrowDown') {\n    e.preventDefault();\n    setOpen(true);\n    setActive(n => Math.min(matches.length - 1, n + 1));\n} if (e.key === 'Enter' && open && matches.length) {\n    e.preventDefault();\n    choose(matches[Math.max(0, Math.min(active, matches.length - 1))]);\n} }}/></label>{open && <ul id=\"choices\" role=\"listbox\" aria-multiselectable={multi}>{matches.map((value, i) => <li key={value}><button id={'choice-' + i} role=\"option\" aria-selected={selected.includes(value)} onClick={() => choose(value)}>{value}</button></li>)}{!matches.length && <li>No options</li>}</ul>}<output data-testid=\"selected\">{selected.join(',')}</output></section>; }\n",
    "architectureNotes": "Follow-up: Support remote option loading without discarding selected IDs that are absent from a particular response.\nTopic reference: https://namastedev.com/practice/multiselect-dropdown\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-multiselect-dropdown. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "multiselect-dropdown-correctness",
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
    "Support remote option loading without discarding selected IDs that are absent from a particular response."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Hidden selected option; disabled option; maximum count.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "multiselect-dropdown-variation",
      "question": "Support remote option loading without discarding selected IDs that are absent from a particular response.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store selection by option ID and keep query/highlight state separate. Expose a properly implemented multiselect listbox or checkbox-based popup with accessible names. Search changes the view, not the selection. Define clear-all, disabled-option, and maximum-selection rules, and provide keyboard ways to add and remove selections. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
