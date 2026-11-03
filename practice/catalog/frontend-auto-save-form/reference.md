# Reference: Frontend: Auto Save Form

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Track a draft revision and the last acknowledged snapshot. Send only an intended snapshot, and ignore acknowledgements that refer to an older revision when displaying saved status. Cancel idle timers on edit/unmount, but do not assume cancelling a client request undoes a server write. Server version checks are needed to prevent late writes from overwriting newer persisted state.",
    "codeOrArtifact": "import {useState,useEffect,useRef} from 'react';export default function App(){const[draft,setDraft]=useState({title:'',body:''}),[saved,setSaved]=useState(''),[status,setStatus]=useState('Ready'),edited=useRef(false);useEffect(()=>{if(!edited.current)return;const timer=setTimeout(()=>{setSaved(JSON.stringify(draft));setStatus('Saved');},40);return()=>clearTimeout(timer);},[draft]);function edit(name,value){edited.current=true;setDraft(old=>({...old,[name]:value}));setStatus('Unsaved');}return <section><label>Title<input name=\"title\" value={draft.title} onChange={e=>edit('title',e.target.value)}/></label><label>Body<input name=\"body\" value={draft.body} onChange={e=>edit('body',e.target.value)}/></label><p data-testid=\"status\">{status}</p><output data-testid=\"saved\">{saved}</output></section>;}",
    "architectureNotes": "Follow-up: Use optimistic concurrency with a document version and an explicit user merge workflow.\nTopic reference: https://namastedev.com/practice/auto-save-form\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "auto-save-form-correctness",
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
    "Use optimistic concurrency with a document version and an explicit user merge workflow."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Rapid edits; old response arrives last; failed save.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "auto-save-form-variation",
      "question": "Use optimistic concurrency with a document version and an explicit user merge workflow.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Track a draft revision and the last acknowledged snapshot. Send only an intended snapshot, and ignore acknowledgements that refer to an older revision when displaying saved status. Cancel idle timers on edit/unmount, but do not assume cancelling a client request undoes a server write. Server version checks are needed to prevent late writes from overwriting newer persisted state. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
