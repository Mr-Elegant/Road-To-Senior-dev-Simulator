# Reference: Frontend: Tic Tac Toe

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Store the board and next player, then derive winner/draw from the board. Ignore moves into occupied squares or after a terminal state. Check the finite winning-line set after each move. Keep cells as accessible buttons with coordinate/status labels. If move history is added, derive the displayed board from the chosen history step.",
    "codeOrArtifact": "import {useState} from 'react';export default function App(){const[board,setBoard]=useState(Array(9).fill('')),[next,setNext]=useState('X');const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],win=lines.map(([a,b,c])=>board[a]&&board[a]===board[b]&&board[b]===board[c]?board[a]:'').find(Boolean),draw=!win&&board.every(Boolean);function play(i){if(board[i]||win||draw)return;setBoard(old=>old.map((v,k)=>k===i?next:v));setNext(n=>n==='X'?'O':'X');}return <section><div role=\"group\" aria-label=\"Board\">{board.map((v,i)=><button key={i} data-cell={i} aria-label={'Cell '+i} onClick={()=>play(i)}>{v||'·'}</button>)}</div><p data-testid=\"status\">{win?'Winner: '+win:draw?'Draw':'Next: '+next}</p><button data-action=\"reset\" onClick={()=>{setBoard(Array(9).fill(''));setNext('X');}}>Reset</button></section>;}",
    "architectureNotes": "Follow-up: Add time-travel history and discard future moves when a player branches from an older board.\nTopic reference: https://namastedev.com/practice/tic-tac-toe\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "tic-tac-toe-correctness",
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
    "Add time-travel history and discard future moves when a player branches from an older board."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Eight winning lines; draw; occupied square.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "tic-tac-toe-variation",
      "question": "Add time-travel history and discard future moves when a player branches from an older board.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Store the board and next player, then derive winner/draw from the board. Ignore moves into occupied squares or after a terminal state. Check the finite winning-line set after each move. Keep cells as accessible buttons with coordinate/status labels. If move history is added, derive the displayed board from the chosen history step. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
