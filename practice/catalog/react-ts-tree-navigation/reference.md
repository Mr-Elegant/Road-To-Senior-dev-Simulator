# Reference: React + TypeScript: Tree Navigation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Separate expansion, selection, and keyboard focus. If implementing an ARIA tree, use roving tabindex and the expected arrow/Home/End rules, including moving to a parent or first child. Stable IDs let expansion survive reordering. For a simple document outline, ordinary nested links may be more appropriate than a tree widget. Lazy loading needs an explicit busy/error state.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\ninterface TreeNode {\n    id: string;\n    title: string;\n    children?: TreeNode[];\n}\nexport interface AppProps {\n    nodes?: TreeNode[];\n}\nimport { useState, useRef } from 'react';\nexport default function App({ nodes = [{ id: 'root', title: 'Root', children: [{ id: 'a', title: 'A' }] }] }: AppProps = {}): React.JSX.Element { const [data, setData] = useState(nodes), [expanded, setExpanded] = useState<string[]>([]), [selected, setSelected] = useState('None'), [name, setName] = useState(''), [error, setError] = useState(''), next = useRef(1), editable = false; function remove(list: TreeNode[], id: string): TreeNode[] { return list.filter(n => n.id !== id).map(n => Array.isArray(n.children) ? { ...n, children: remove(n.children, id) } : n); } function add() { const title = name.trim(); if (!title) {\n    setError('Name required');\n    return;\n} if (!data[0] || !Array.isArray(data[0].children)) {\n    setError('No folder');\n    return;\n} if (data[0].children.some(n => n.title === title)) {\n    setError('Name exists');\n    return;\n} const id = 'new' + next.current++; setData(old => old.map((n, i) => i === 0 ? { ...n, children: [...(n.children ?? []), { id, title }] } : n)); setName(''); setError(''); } function render(node: TreeNode): React.ReactNode { const folder = Array.isArray(node.children), open = expanded.includes(node.id); return <li key={node.id} data-node={node.id}>{folder ? <button data-open={node.id} aria-expanded={open} onClick={() => { setSelected(node.id); setExpanded(old => old.includes(node.id) ? old.filter(v => v !== node.id) : [...old, node.id]); }}>{node.title}</button> : <button data-select={node.id} onClick={() => setSelected(node.id)}>{node.title}</button>}{editable && <button data-delete={node.id} onClick={() => { setData(old => remove(old, node.id)); setSelected('None'); }}>Delete</button>}{folder && open && <ul>{node.children?.map(render)}</ul>}</li>; } return <section>{editable && <><label>New file<input aria-label=\"New file\" value={name} onChange={e => setName(e.target.value)}/></label><button data-action=\"add\" onClick={add}>Add file</button></>}<ul>{data.map(render)}</ul><output data-testid=\"selected\">{selected}</output><p role=\"alert\">{error}</p></section>; }\n",
    "architectureNotes": "Follow-up: Virtualize a large tree while keeping the visible keyboard order and accessibility relationships correct.\nTopic reference: https://namastedev.com/practice/tree-navigation\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-tree-navigation. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "tree-navigation-correctness",
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
    "Virtualize a large tree while keeping the visible keyboard order and accessibility relationships correct."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Collapsed children; disabled node; Home/End.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "tree-navigation-variation",
      "question": "Virtualize a large tree while keeping the visible keyboard order and accessibility relationships correct.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Separate expansion, selection, and keyboard focus. If implementing an ARIA tree, use roving tabindex and the expected arrow/Home/End rules, including moving to a parent or first child. Stable IDs let expansion survive reordering. For a simple document outline, ordinary nested links may be more appropriate than a tree widget. Lazy loading needs an explicit busy/error state. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
