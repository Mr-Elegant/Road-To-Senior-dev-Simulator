# Reference: Frontend: Reusable Toast

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Own the queue in one provider or local controller and assign each toast its own deadline. Removing one toast must not clear unrelated timers. Use polite status announcements for ordinary messages and reserve urgent alerts for actual urgency. Pause timers if required by the product, preserve a dismiss button, and clean up timers when the controller unmounts.",
    "codeOrArtifact": "import {useState,useRef,useEffect} from 'react';export default function App({autoCloseMs=0}){const[items,setItems]=useState([]),next=useRef(1),timers=useRef([]);useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);function notify(){const id=next.current++;setItems(old=>[...old,id].slice(-4));if(autoCloseMs>0)timers.current.push(setTimeout(()=>setItems(old=>old.filter(v=>v!==id)),autoCloseMs));}return <section><button data-action=\"notify\" onClick={notify}>Notify</button><ul aria-live=\"polite\">{items.map(id=><li key={id} data-toast={id}>Notification {id}<button data-dismiss={id} onClick={()=>setItems(old=>old.filter(v=>v!==id))}>Dismiss</button></li>)}</ul></section>;}",
    "architectureNotes": "Follow-up: Add action buttons whose focus and timeout policy do not remove content while a user is interacting.\nTopic reference: https://namastedev.com/practice/reusable-toast\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "reusable-toast-correctness",
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
    "Add action buttons whose focus and timeout policy do not remove content while a user is interacting."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Multiple toasts; manual dismissal; expiration.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "reusable-toast-variation",
      "question": "Add action buttons whose focus and timeout policy do not remove content while a user is interacting.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Own the queue in one provider or local controller and assign each toast its own deadline. Removing one toast must not clear unrelated timers. Use polite status announcements for ordinary messages and reserve urgent alerts for actual urgency. Pause timers if required by the product, preserve a dismiss button, and clean up timers when the controller unmounts. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
