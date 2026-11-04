# Reference: How do action payloads work in Redux Toolkit and how do you pass parameters to actions?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "In Redux Toolkit, any argument you pass to an auto-generated action creator function is automatically assigned to `action.payload` on the dispatched action object. Inside the reducer function, you read `action.payload` to access the passed data. In TypeScript, you type this parameter using `PayloadAction<T>` from `@reduxjs/toolkit` to ensure type-safe payloads.",
    "example": "const cartSlice = createSlice({\n  name: 'cart',\n  initialState: { items: [] },\n  reducers: {\n    // Reducer reads action.payload\n    addItem: (state, action) => {\n      // action.payload is the product object passed into dispatch\n      state.items.push(action.payload);\n    },\n    removeItemById: (state, action) => {\n      // action.payload is the id string\n      state.items = state.items.filter(item => item.id !== action.payload);\n    }\n  }\n});\n\n// Calling action creator passes data into payload:\ndispatch(addItem({ id: 'p1', title: 'Keyboard', price: 49 }));\ndispatch(removeItemById('p1'));",
    "followUp": {
      "question": "If you call dispatch(addItem(prod1, prod2)), what happens to the second argument?",
      "expectedAnswer": "By default, RTK action creators only put the FIRST argument into action.payload. If you need to pass multiple items, wrap them in an object: dispatch(addItem({ item1, item2 }))."
    }
  },
  "expectedConcepts": [
    "action.payload convention",
    "Passing arguments when calling the action creator dispatch(addItem(item))",
    "Accessing action.payload inside the reducer",
    "TypeScript typing with PayloadAction<T>"
  ]
}
```
