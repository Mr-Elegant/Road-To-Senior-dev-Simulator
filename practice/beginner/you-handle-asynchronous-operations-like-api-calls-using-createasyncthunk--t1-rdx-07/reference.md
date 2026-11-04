# Reference: How do you handle asynchronous operations like API calls using createAsyncThunk?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`createAsyncThunk` is an API from Redux Toolkit that handles asynchronous request lifecycles. It takes an action type string and a payload creator function that returns a Promise. It automatically generates and dispatches three action types: `.pending` (when the request starts), `.fulfilled` (when data resolves successfully), and `.rejected` (when an error occurs). You handle these states in the slice’s `extraReducers` builder to update loading and error state.",
    "example": "// 1. Define async thunk\nexport const fetchUsers = createAsyncThunk('users/fetch', async () => {\n  const response = await fetch('/api/users');\n  return response.json(); // Becomes action.payload in fulfilled\n});\n\n// 2. Handle in slice extraReducers\nconst usersSlice = createSlice({\n  name: 'users',\n  initialState: { list: [], loading: false, error: null },\n  reducers: {},\n  extraReducers: (builder) => {\n    builder\n      .addCase(fetchUsers.pending, (state) => {\n        state.loading = true;\n      })\n      .addCase(fetchUsers.fulfilled, (state, action) => {\n        state.loading = false;\n        state.list = action.payload;\n      })\n      .addCase(fetchUsers.rejected, (state, action) => {\n        state.loading = false;\n        state.error = action.error.message;\n      });\n  },\n});",
    "followUp": {
      "question": "Where does the value returned from the async payload creator function end up?",
      "expectedAnswer": "It is automatically assigned to action.payload in the fulfilled reducer case."
    }
  },
  "expectedConcepts": [
    "What a thunk is: Function containing async logic dispatched like a regular action",
    "createAsyncThunk generates three promise lifecycle actions: pending, fulfilled, rejected",
    "Handling lifecycle actions in extraReducers inside createSlice",
    "Managing loading spinners and error messages cleanly"
  ]
}
```
