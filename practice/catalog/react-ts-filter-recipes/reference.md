# Reference: React + TypeScript: Filter Recipes

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Filtering is a derived view over immutable props. A separate ID list tracks selection, so a search cannot accidentally delete hidden choices. Unique category options are built in first-seen order. Functional selection updates support predictable toggles, and accessible button names identify the dish and its next action. A large remote catalog would require a separate query, pagination, and consistency policy.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    recipes?: {\n        id: string;\n        name: string;\n        category: string;\n    }[];\n}\nimport { useState } from 'react';\nexport default function App({ recipes = [] }: AppProps = {}): React.JSX.Element {\n    const [query, setQuery] = useState('');\n    const [category, setCategory] = useState('All');\n    const [selected, setSelected] = useState<string[]>([]);\n    const categories = [...new Set(recipes.map(r => r.category))];\n    const visible = recipes.filter(r => r.name.toLowerCase().includes(query.trim().toLowerCase()) && (category === 'All' || r.category === category));\n    function toggle(id: string) { setSelected(old => old.includes(id) ? old.filter(item => item !== id) : [...old, id]); }\n    return <section><label>Search recipes <input value={query} onChange={e => setQuery(e.target.value)}/></label>\n    <label>Category <select value={category} onChange={e => setCategory(e.target.value)}><option>All</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label>\n    <ul data-testid=\"recipes\">{visible.map(r => <li key={r.id}>{r.name}<button type=\"button\" aria-label={(selected.includes(r.id) ? 'Deselect ' : 'Select ') + r.name} onClick={() => toggle(r.id)}>{selected.includes(r.id) ? 'Deselect' : 'Select'}</button></li>)}</ul>\n    {!visible.length && <p data-testid=\"empty\">No matching recipes</p>}<output data-testid=\"selected-count\">{selected.length}</output></section>;\n}\n",
    "architectureNotes": "\nOriginal React workspace: /challenge/react-ui-recipe-browser. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "react-ui-recipe-browser-behavior",
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
    "Discarding selection whenever a recipe is filtered out.",
    "Mutating props or using the visible row index as recipe identity."
  ],
  "followUps": [
    {
      "id": "recipe-follow",
      "question": "What if selected recipes disappear from a refreshed dataset?",
      "expectedConcepts": [
        "Identity",
        "Reconciliation policy"
      ],
      "sampleStrongAnswer": "Choose an explicit product policy: retain unavailable selections with a warning or reconcile them against authoritative IDs. Do not silently lose choices merely because a search response omits them; distinguish filtering from actual deletion."
    }
  ]
}
```
