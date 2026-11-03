# Reference: React + TypeScript: Product Store

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Separate remote product data from local query and cart state. Use stable product IDs and validate stale or missing products. Keep prices authoritative on the server and treat local cart totals as previews. A complete commerce system also needs checkout, stock reservation, idempotent payment, and recovery; browsing components alone do not provide those guarantees.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\nexport interface AppProps {\n    products?: ({\n        \"id\": string;\n        \"name\": string;\n        \"price\": number;\n    })[];\n}\nimport { useState } from 'react';\nexport default function App({ products = [{ id: 'a', name: 'Alpha', price: 100 }, { id: 'b', name: 'Beta', price: 250 }] }: AppProps = {}): React.JSX.Element { const [quantities, setQuantities] = useState<Record<string, number>>({}), [discount, setDiscount] = useState(0), [query, setQuery] = useState(''), store = true; const subtotal = products.reduce((sum, p) => sum + (quantities[p.id] || 0) * p.price, 0); return <section>{store && <label>Search<input aria-label=\"Search\" value={query} onChange={e => setQuery(e.target.value)}/></label>}<ul>{products.filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase())).map(p => <li key={p.id} data-product={p.id}>{p.name}<button data-add={p.id} onClick={() => setQuantities(old => ({ ...old, [p.id]: (old[p.id] || 0) + 1 }))}>Add</button><button data-remove={p.id} onClick={() => setQuantities(old => ({ ...old, [p.id]: Math.max(0, (old[p.id] || 0) - 1) }))}>Remove</button><output data-quantity={p.id}>{quantities[p.id] || 0}</output></li>)}</ul><label>Discount<select aria-label=\"Discount\" value={discount} onChange={e => setDiscount(Number(e.target.value))}><option value=\"0\">None</option><option value=\"10\">Ten percent</option></select></label><output data-testid=\"total\">{subtotal - Math.round(subtotal * discount / 100)}</output></section>; }\n",
    "architectureNotes": "Follow-up: Trace a checkout across quote creation, inventory hold, payment confirmation, and retry-safe order creation.\nTopic reference: https://namastedev.com/practice/product-store\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-product-store. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "product-store-correctness",
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
    "Trace a checkout across quote creation, inventory hold, payment confirmation, and retry-safe order creation."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Missing product; stale price; empty catalog.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "product-store-variation",
      "question": "Trace a checkout across quote creation, inventory hold, payment confirmation, and retry-safe order creation.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Separate remote product data from local query and cart state. Use stable product IDs and validate stale or missing products. Keep prices authoritative on the server and treat local cart totals as previews. A complete commerce system also needs checkout, stock reservation, idempotent payment, and recovery; browsing components alone do not provide those guarantees. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
