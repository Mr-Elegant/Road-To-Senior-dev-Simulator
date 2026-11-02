# Reference: What are the three core principles and concepts of Redux: Store, Actions, and Reducers?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Redux relies on three core concepts: 1) **The Store**: A single centralized JavaScript object that holds the complete state tree for the application. 2) **Actions**: Plain JavaScript objects with a `type` property (and optional `payload`) describing an event that occurred. 3) **Reducers**: Pure functions that take the current state and an action, calculate the new state, and return it. State is read-only and can only be updated by dispatching an action to a reducer.",
    "example": "// 1. Action\nconst depositMoney = { type: 'bank/deposit', payload: 100 };\n\n// 2. Reducer (calculates new state)\nfunction bankReducer(state = { balance: 0 }, action) {\n  switch (action.type) {\n    case 'bank/deposit':\n      return { ...state, balance: state.balance + action.payload };\n    default:\n      return state;\n  }\n}\n\n// 3. Store holds it: store.dispatch(depositMoney);",
    "followUp": {
      "question": "Why must Redux reducers be pure functions with no side effects?",
      "expectedAnswer": "Because pure functions are deterministic: given the same state and action, they always return the exact same output. This makes state predictable, reproducible, and enables features like time-travel debugging."
    }
  },
  "expectedConcepts": [
    "Store: The single source of truth holding the entire state tree",
    "Action: Plain JavaScript object describing \"what happened\" (type, payload)",
    "Reducer: Pure function taking (previousState, action) => newState",
    "One-way data flow: View -> Dispatch Action -> Reducer updates Store -> View re-renders"
  ]
}
```
