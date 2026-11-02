# Reference: Keep the newest search result

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "code": "function reduceSearch(state, action) {\n  if (action.type === 'pending') {\n    return { ...state, status: 'loading', activeRequestId: action.requestId, error: null };\n  }\n  if (action.requestId !== state.activeRequestId || state.activeRequestId === null) return state;\n  if (action.type === 'fulfilled') return { ...state, items: action.items, status: 'succeeded', activeRequestId: null, error: null };\n  if (action.type === 'rejected') return { ...state, status: 'failed', activeRequestId: null, error: action.error };\n  return state;\n}",
    "rootCause": "Asynchronous responses resolve in non-deterministic order (network jitter). Without an AbortController or a monotonic request-ID/sequence tracker in Redux state, the latest resolved promise always commits to state regardless of when it was initiated.",
    "explanation": "1. Utilize Redux Toolkit `thunkAPI.signal` with `fetch(url, { signal: thunkAPI.signal })` or `AbortController` to abort in-flight requests when a new search query is dispatched.\n2. In the Redux slice, track `latestRequestId: string | null` or monotonic `timestamp`. In the `extraReducers.fulfilled` matcher, compare `action.meta.requestId === state.latestRequestId`. If mismatched, silently ignore the stale payload.",
    "dashboardFix": "// ✅ SENIOR FIX: Abort signal + Request ID monotonic guard\nexport const fetchApplications = createAsyncThunk(\n  'applications/fetch',\n  async (params: LoanFilters, { signal }) => {\n    // The caller must abort the previous dispatched thunk to cancel its fetch.\n    // Passing this signal alone does not automatically cancel older requests.\n    const res = await fetch(`/api/applications?search=${params.search}`, { signal });\n    return await res.json();\n  }\n);\n\nextraReducers: (builder) => {\n  builder\n    .addCase(fetchApplications.pending, (state, action) => {\n      state.status = 'loading';\n      state.latestRequestId = action.meta.requestId; // Record active request token\n    })\n    .addCase(fetchApplications.fulfilled, (state, action) => {\n      // Monotonic guard: Only accept if this matches the latest dispatched thunk!\n      if (state.latestRequestId === action.meta.requestId) {\n        state.status = 'succeeded';\n        state.items = action.payload.items;\n        state.totalCount = action.payload.totalCount;\n      }\n    });\n}"
  }
}
```
