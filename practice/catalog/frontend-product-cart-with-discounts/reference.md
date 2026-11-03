# Reference: Frontend: Product Cart with Discounts

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Normalize products and cart quantities by ID. Derive a pricing pipeline with a documented order for line discounts, order discounts, tax, and shipping. Use appropriate monetary arithmetic and ensure discounts cannot create negative payable amounts unless credits are part of the model. Client totals are estimates: the server validates prices, coupons, inventory, and final payable amounts.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({products=[{id:'a',name:'Alpha',price:100},{id:'b',name:'Beta',price:250}]}){const[quantities,setQuantities]=useState({}),[discount,setDiscount]=useState(0),[query,setQuery]=useState(''),store=false;const subtotal=products.reduce((sum,p)=>sum+(quantities[p.id]||0)*p.price,0);return <section>{store&&<label>Search<input aria-label=\"Search\" value={query} onChange={e=>setQuery(e.target.value)}/></label>}<ul>{products.filter(p=>p.name.toLowerCase().includes(query.trim().toLowerCase())).map(p=><li key={p.id} data-product={p.id}>{p.name}<button data-add={p.id} onClick={()=>setQuantities(old=>({...old,[p.id]:(old[p.id]||0)+1}))}>Add</button><button data-remove={p.id} onClick={()=>setQuantities(old=>({...old,[p.id]:Math.max(0,(old[p.id]||0)-1)}))}>Remove</button><output data-quantity={p.id}>{quantities[p.id]||0}</output></li>)}</ul><label>Discount<select aria-label=\"Discount\" value={discount} onChange={e=>setDiscount(Number(e.target.value))}><option value=\"0\">None</option><option value=\"10\">Ten percent</option></select></label><output data-testid=\"total\">{subtotal-Math.round(subtotal*discount/100)}</output></section>;}",
    "architectureNotes": "Follow-up: Design a server quote/version mechanism so payment uses the exact accepted pricing snapshot.\nTopic reference: https://namastedev.com/practice/product-cart-with-discounts\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "product-cart-with-discounts-correctness",
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
    "Design a server quote/version mechanism so payment uses the exact accepted pricing snapshot."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Expired coupon; stacked discounts; quantity changes.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "product-cart-with-discounts-variation",
      "question": "Design a server quote/version mechanism so payment uses the exact accepted pricing snapshot.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Normalize products and cart quantities by ID. Derive a pricing pipeline with a documented order for line discounts, order discounts, tax, and shipping. Use appropriate monetary arithmetic and ensure discounts cannot create negative payable amounts unless credits are part of the model. Client totals are estimates: the server validates prices, coupons, inventory, and final payable amounts. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
