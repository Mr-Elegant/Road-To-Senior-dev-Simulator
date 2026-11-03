# Frontend: Bishop Moves

Collection: catalog · ID: `frontend-bishop-moves` · Mode: **react**

## Business context

Build and verify the core behavior behind Bishop Moves. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({start=[3,3],occupied=[]}) for an 8x8 geometric bishop movement lab. Occupants are {row,col,side:own|opponent}. Render 64 buttons with data-cell="row,col", data-allowed=true/false, and output the count in [data-testid="moves"]. Clicking any square selects it. Own pieces block/exclude destinations, opponents can be captured but stop sliding rays. Pawns move upward, may advance twice only from row 6 through two empty cells, and capture opponents diagonally. King safety, castling, en-passant and promotion are excluded from this bounded geometry exercise.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Integrate the ray model into an attack-map calculation that handles pinned pieces deliberately.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-bishop-moves
npm run practice:watch -- catalog/frontend-bishop-moves
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
