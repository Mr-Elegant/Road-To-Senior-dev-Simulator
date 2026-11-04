# Reference: What is createSlice in Redux Toolkit and how does it simplify Redux code?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`createSlice` is a function from Redux Toolkit that accepts a slice name, an `initialState`, and an object of reducer functions. It automatically generates the reducer function along with corresponding action creators and action types for each reducer. This drastically reduces boilerplate by eliminating manual action constants, action creators, and `switch` statements.",
    "example": "import { createSlice, PayloadAction } from '@reduxjs/toolkit';\n\nconst counterSlice = createSlice({\n  name: 'counter',\n  initialState: { value: 0 },\n  reducers: {\n    increment: (state) => {\n      state.value += 1;\n    },\n    incrementByAmount: (state, action) => {\n      state.value += action.payload;\n    },\n  },\n});\n\n// Auto-generated action creators:\nexport const { increment, incrementByAmount } = counterSlice.actions;\n// Auto-generated reducer:\nexport default counterSlice.reducer;",
    "code": "import { createSlice } from '@reduxjs/toolkit';\n\nexport const themeSlice = createSlice({\n  name: 'theme',\n  initialState: { mode: 'light' },\n  reducers: {\n    toggleTheme: (state) => {\n      state.mode = state.mode === 'light' ? 'dark' : 'light';\n    },\n  },\n});",
    "followUp": {
      "question": "What is the action type string generated for the increment reducer in the example above?",
      "expectedAnswer": "It combines the slice name and the reducer name: \"counter/increment\"."
    }
  },
  "expectedConcepts": [
    "Combines actions and reducers in a single file/function",
    "Requires name, initialState, and reducers object",
    "Automatically generates action creators matching reducer keys",
    "Eliminates boilerplate switch statements and manual action type constants"
  ]
}
```
