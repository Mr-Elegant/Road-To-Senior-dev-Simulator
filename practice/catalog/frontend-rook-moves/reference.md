# Reference: Frontend: Rook Moves

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Walk horizontally and vertically from the origin. Add empty squares until the first blocker; include an opposing blocker as a possible capture and exclude a friendly blocker. Stop that ray either way. Keep row/column bounds explicit to prevent linear-index wraparound. Castling and king safety require additional state beyond this movement exercise.",
    "codeOrArtifact": "import {useState} from 'react';function allowed(row,col,occupied){const result=[],at=(r,c)=>occupied.find(p=>p.row===r&&p.col===c),inside=(r,c)=>r>=0&&r<8&&c>=0&&c<8;\n  const piece=\"rook\";\n  if(piece==='pawn'){if(inside(row-1,col)&&!at(row-1,col)){result.push([row-1,col]);if(row===6&&!at(row-2,col))result.push([row-2,col]);}for(const dc of [-1,1])if(inside(row-1,col+dc)&&at(row-1,col+dc)?.side==='opponent')result.push([row-1,col+dc]);return result;}\n  if(piece==='knight'||piece==='king'){const offsets=piece==='knight'?[[1,2],[1,-2],[-1,2],[-1,-2],[2,1],[2,-1],[-2,1],[-2,-1]]:[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];for(const[dr,dc]of offsets){const r=row+dr,c=col+dc;if(inside(r,c)&&at(r,c)?.side!=='own')result.push([r,c]);}return result;}\n  const directions=piece==='rook'?[[1,0],[-1,0],[0,1],[0,-1]]:piece==='bishop'?[[1,1],[1,-1],[-1,1],[-1,-1]]:[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];\n  for(const[dr,dc]of directions){let r=row+dr,c=col+dc;while(inside(r,c)){const blocker=at(r,c);if(blocker?.side!=='own')result.push([r,c]);if(blocker)break;r+=dr;c+=dc;}}return result;}\n  export default function App({start=[3,3],occupied=[]}){const[selected,setSelected]=useState(start);const targets=allowed(selected[0],selected[1],occupied).map(p=>p.join(','));return <section><div role=\"group\" aria-label=\"Board\" style={{display:'grid',gridTemplateColumns:'repeat(8,minmax(0,1fr))'}}>{Array.from({length:64},(_,i)=>{const r=Math.floor(i/8),c=i%8,id=r+','+c;return <button key={id} data-cell={id} data-allowed={targets.includes(id)} aria-label={'Square '+id} aria-pressed={selected[0]===r&&selected[1]===c} onClick={()=>setSelected([r,c])}>{targets.includes(id)?'Move':'·'}</button>;})}</div><output data-testid=\"moves\">{targets.length}</output></section>;}",
    "architectureNotes": "Follow-up: Separate geometric destinations from legal moves after filtering for an exposed king.\nTopic reference: https://namastedev.com/practice/rook-moves\nThis app contract and reference were independently authored."
  },
  "rubric": [
    {
      "id": "rook-moves-correctness",
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
    "Separate geometric destinations from legal moves after filtering for an exposed king."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Corner; edge; friendly/opposing blockers.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "rook-moves-variation",
      "question": "Separate geometric destinations from legal moves after filtering for an exposed king.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Walk horizontally and vertically from the origin. Add empty squares until the first blocker; include an opposing blocker as a possible capture and exclude a friendly blocker. Stop that ray either way. Keep row/column bounds explicit to prevent linear-index wraparound. Castling and king safety require additional state beyond this movement exercise. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
