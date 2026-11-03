# Reference: Frontend: Quiz App

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Use stable question IDs and store answers by ID. Derive answered count and score from those answers and the authored scoring rule. Prevent accidental double submission and define whether users may revise previous answers. Model in-progress and completed states explicitly, and make result feedback accessible without forcing unexpected focus changes.",
    "codeOrArtifact": "import {useState} from 'react';export default function App({questions=[{id:'q',text:'2+2',options:['3','4'],correct:1}]}){const[index,setIndex]=useState(0),[answers,setAnswers]=useState({}),[done,setDone]=useState(false),q=questions[index];return <section>{!done?<><h2>{q.text}</h2>{q.options.map((value,i)=><button key={i} data-option={i} aria-pressed={answers[q.id]===i} onClick={()=>setAnswers(old=>({...old,[q.id]:i}))}>{value}</button>)}<button data-action=\"next\" disabled={answers[q.id]===undefined} onClick={()=>{if(index===questions.length-1)setDone(true);else setIndex(i=>i+1);}}>Next</button></>:<output data-testid=\"score\">{questions.filter(item=>answers[item.id]===item.correct).length+'/'+questions.length}</output>}<button data-action=\"restart\" onClick={()=>{setIndex(0);setAnswers({});setDone(false);}}>Restart</button></section>;}",
    "architectureNotes": "Follow-up: Support multiple correct answers with a documented partial-credit policy and reproducible question order.\nTopic reference: https://namastedev.com/practice/quiz-app\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "quiz-app-correctness",
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
    "Support multiple correct answers with a documented partial-credit policy and reproducible question order."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Unanswered question; revision; last question.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "quiz-app-variation",
      "question": "Support multiple correct answers with a documented partial-credit policy and reproducible question order.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Use stable question IDs and store answers by ID. Derive answered count and score from those answers and the authored scoring rule. Prevent accidental double submission and define whether users may revise previous answers. Model in-progress and completed states explicitly, and make result feedback accessible without forcing unexpected focus changes. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
