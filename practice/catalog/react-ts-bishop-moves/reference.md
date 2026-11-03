# Reference: React + TypeScript: Bishop Moves

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Walk in the four diagonal directions with explicit row/column bounds. Empty squares are reachable; the first opposing occupant can be included as a capture, while a friendly occupant cannot. Stop after either type of blocker. Reuse traversal mechanics without confusing this geometric result with legal moves under king safety.\n\nTypeScript adaptation: the reference models props, state, events, refs and domain data explicitly. Strict checking catches invalid updates and nullable values before the original behavioral cases execute. Types describe inputs; runtime validation still handles untrusted form text.",
    "codeOrArtifact": "import type * as React from 'react';\ninterface Occupant {\n    row: number;\n    col: number;\n    side: \"own\" | \"opponent\";\n}\nexport interface AppProps {\n    start?: number[];\n    occupied?: Occupant[];\n}\nimport { useState } from 'react';\nfunction allowed(row: number, col: number, occupied: Occupant[]): number[][] {\n    const result = [], at = (r: number, c: number) => occupied.find(p => p.row === r && p.col === c), inside = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;\n    let piece: string = \"bishop\";\n    if (piece === 'pawn') {\n        if (inside(row - 1, col) && !at(row - 1, col)) {\n            result.push([row - 1, col]);\n            if (row === 6 && !at(row - 2, col))\n                result.push([row - 2, col]);\n        }\n        for (const dc of [-1, 1])\n            if (inside(row - 1, col + dc) && at(row - 1, col + dc)?.side === 'opponent')\n                result.push([row - 1, col + dc]);\n        return result;\n    }\n    if (piece === 'knight' || piece === 'king') {\n        const offsets = piece === 'knight' ? [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]] : [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];\n        for (const [dr, dc] of offsets) {\n            const r = row + dr, c = col + dc;\n            if (inside(r, c) && at(r, c)?.side !== 'own')\n                result.push([r, c]);\n        }\n        return result;\n    }\n    const directions = piece === 'rook' ? [[1, 0], [-1, 0], [0, 1], [0, -1]] : piece === 'bishop' ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];\n    for (const [dr, dc] of directions) {\n        let r = row + dr, c = col + dc;\n        while (inside(r, c)) {\n            const blocker = at(r, c);\n            if (blocker?.side !== 'own')\n                result.push([r, c]);\n            if (blocker)\n                break;\n            r += dr;\n            c += dc;\n        }\n    }\n    return result;\n}\nexport default function App({ start = [3, 3], occupied = [] }: AppProps = {}): React.JSX.Element { const [selected, setSelected] = useState(start); const targets = allowed(selected[0], selected[1], occupied).map(p => p.join(',')); return <section><div role=\"group\" aria-label=\"Board\" style={{ display: 'grid', gridTemplateColumns: 'repeat(8,minmax(0,1fr))' }}>{Array.from({ length: 64 }, (_, i) => { const r = Math.floor(i / 8), c = i % 8, id = r + ',' + c; return <button key={id} data-cell={id} data-allowed={targets.includes(id)} aria-label={'Square ' + id} aria-pressed={selected[0] === r && selected[1] === c} onClick={() => setSelected([r, c])}>{targets.includes(id) ? 'Move' : '·'}</button>; })}</div><output data-testid=\"moves\">{targets.length}</output></section>; }\n",
    "architectureNotes": "Follow-up: Integrate the ray model into an attack-map calculation that handles pinned pieces deliberately.\nTopic reference: https://namastedev.com/practice/bishop-moves\nThis app contract and reference were independently authored.\nOriginal React workspace: /challenge/frontend-bishop-moves. The TypeScript copy uses a separate scenario ID and attempt history."
  },
  "rubric": [
    {
      "id": "bishop-moves-correctness",
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
    "Integrate the ray model into an attack-map calculation that handles pinned pieces deliberately."
  ],
  "commonMistakes": [
    "Ignoring contract boundaries such as: Corner; diagonal blocker; first opponent.",
    "Treating a local deterministic model as proof of durable storage, authorization, distributed coordination, or physical-world guarantees."
  ],
  "followUps": [
    {
      "id": "bishop-moves-variation",
      "question": "Integrate the ray model into an attack-map calculation that handles pinned pieces deliberately.",
      "expectedConcepts": [
        "Explicit assumptions",
        "State/algorithm invariant",
        "Boundary verification"
      ],
      "sampleStrongAnswer": "Walk in the four diagonal directions with explicit row/column bounds. Empty squares are reachable; the first opposing occupant can be included as a capture, while a friendly occupant cannot. Stop after either type of blocker. Reuse traversal mechanics without confusing this geometric result with legal moves under king safety. For the variation, specify the changed contract first, add counterexamples, and verify that the revised implementation preserves the new invariant."
    }
  ]
}
```
