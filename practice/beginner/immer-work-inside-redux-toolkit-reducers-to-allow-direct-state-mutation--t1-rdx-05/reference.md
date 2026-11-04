# Reference: How does Immer work inside Redux Toolkit reducers to allow "direct state mutation"?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "In traditional Redux, mutating state directly (`state.value++` or `state.todos.push()`) causes severe bugs because React cannot detect mutations without new object references. Redux Toolkit integrates the **Immer** library inside `createSlice`. Immer gives you a special \"draft\" state that records all changes you make with standard mutable syntax, and then automatically produces a pristine, safely copied immutable state tree behind the scenes.",
    "example": "// Traditional Redux (Painful deep copy)\nreturn {\n  ...state,\n  user: {\n    ...state.user,\n    address: {\n      ...state.user.address,\n      city: 'Boston'\n    }\n  }\n};\n\n// With Redux Toolkit (Immer):\nupdateCity: (state, action) => {\n  state.user.address.city = action.payload; // Safe and clean!\n}",
    "followUp": {
      "question": "Can you both mutate the state AND return a new state in an Immer reducer?",
      "expectedAnswer": "No! In Immer reducers, you should either mutate the draft state OR return a completely new state, never both in the same reducer, as Immer throws an error."
    }
  },
  "expectedConcepts": [
    "Original Redux rule: Never mutate state directly (always return new copies)",
    "Redux Toolkit wraps reducers with Immer.js automatically",
    "Draft state tracking mutations and producing an immutable copy behind the scenes",
    "Syntactic convenience (state.items.push(item)) without breaking immutability"
  ]
}
```
