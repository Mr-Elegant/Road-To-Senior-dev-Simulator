# Reference: Read current filters when a refresh actually runs

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "code": "function createRefresh(getState, send) {\n  return () => {\n    const state = getState();\n    send({ ...state.filters, page: state.pagination.page, limit: state.pagination.limit });\n  };\n}",
    "rootCause": "A callback or `useEffect` timer enclosed `filters` without updating the closure, or did not read the latest state from `getState()` inside a Redux thunk.",
    "explanation": "Inside Redux thunks, always read `getState()` dynamically at execution time rather than relying on arguments passed seconds earlier. In React effects, ensure timer callbacks use `useRef` or explicit dependency arrays with proper cleanup.",
    "dashboardFix": "// ✅ SENIOR FIX: Read fresh state via getState() or use fresh ref\nexport const refreshCurrentApplications = createAsyncThunk(\n  'applications/refresh',\n  async (_, { getState, dispatch }) => {\n    // Read the *active* live state at the exact moment this thunk executes:\n    const { applications } = getState() as RootState;\n    return await loanService.getApplications({\n      ...applications.filters,\n      page: applications.pagination.page,\n      limit: applications.pagination.limit,\n    });\n  }\n);"
  }
}
```
