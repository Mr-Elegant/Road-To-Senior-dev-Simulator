# Reference: Frontend: Event Management

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store stable event IDs and distinguish instants from local calendar entries. Define overlap boundaries, such as half-open intervals, before checking conflicts. Parse and validate user fields explicitly, including end after start. Keep editing drafts separate from saved events. Recurring events and daylight-saving transitions cannot be handled reliably by adding fixed milliseconds to local dates.",
    "codeOrArtifact": "import {useState,useRef} from 'react';export default function App(){const[fields,setFields]=useState({title:'',start:'',end:''}),[events,setEvents]=useState([]),[error,setError]=useState(''),next=useRef(1);function add(){const start=Number(fields.start),end=Number(fields.end);if(!fields.title.trim()||!fields.start.trim()||!fields.end.trim()||!Number.isInteger(start)||!Number.isInteger(end)||start<0||end>24||start>=end){setError('Invalid event');return;}if(events.some(e=>start<e.end&&end>e.start)){setError('Overlap');return;}const id=String(next.current++);setEvents(old=>[...old,{id,title:fields.title.trim(),start,end}]);setError('');}return <section>{['title','start','end'].map(name=><label key={name}>{name}<input name={name} value={fields[name]} onChange={e=>setFields(old=>({...old,[name]:e.target.value}))}/></label>)}<button data-action=\"add\" onClick={add}>Add</button><ul>{events.map(event=><li key={event.id} data-event={event.id}>{event.title+':'+event.start+'-'+event.end}<button data-delete={event.id} onClick={()=>setEvents(old=>old.filter(e=>e.id!==event.id))}>Delete</button></li>)}</ul><p role=\"alert\">{error}</p></section>;}",
    "architectureNotes": "Follow-up: Add recurrence with a timezone-aware rule model and define how exceptions and rescheduling are represented.\nTopic reference: https://namastedev.com/practice/event-management\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "event-management-correctness",
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
    "Add recurrence with a timezone-aware rule model and define how exceptions and rescheduling are represented."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Adjacent events; exact overlap; invalid interval.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "event-management-variation",
      "question": "Add recurrence with a timezone-aware rule model and define how exceptions and rescheduling are represented.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store stable event IDs and distinguish instants from local calendar entries. Define overlap boundaries, such as half-open intervals, before checking conflicts. Parse and validate user fields explicitly, including end after start. Keep editing drafts separate from saved events. Recurring events and daylight-saving transitions cannot be handled reliably by adding fixed milliseconds to local dates. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
