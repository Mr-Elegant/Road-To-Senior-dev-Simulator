# Reference: Leave loading and support retry after a failure

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "code": "function reduceRequest(state, action) {\n  if (action.type === 'pending') return { ...state, status: 'loading', activeRequestId: action.requestId, error: null };\n  if (state.activeRequestId === null || state.activeRequestId !== action.requestId) return state;\n  if (action.type === 'fulfilled') return { ...state, status: 'succeeded', activeRequestId: null, items: action.items, error: null };\n  if (action.type === 'rejected') return { ...state, status: action.aborted ? 'idle' : 'failed', activeRequestId: null, error: action.aborted ? null : (action.error || 'Request failed') };\n  return state;\n}",
    "rootCause": "The catch block in the API call threw an unhandled error, or `state.status = \"loading\"` was never transitioned to `state.status = \"failed\"` in `extraReducers.rejected`.",
    "explanation": "1. Handle `fetchApplications.rejected` in the reducer, setting `state.status = \"failed\"` and recording `state.error = action.error.message`.\n2. Render an error alert component with an explicit \"Retry Request\" button that dispatches the thunk again.",
    "dashboardFix": "// ✅ SENIOR FIX: Comprehensive rejected handler + Retry UI\nbuilder\n  .addCase(fetchApplications.pending, (state) => {\n    state.status = 'loading';\n    state.error = null;\n  })\n  .addCase(fetchApplications.fulfilled, (state, action) => {\n    state.status = 'succeeded';\n    state.items = action.payload.items;\n    state.totalCount = action.payload.totalCount;\n    state.error = null;\n  })\n  .addCase(fetchApplications.rejected, (state, action) => {\n    state.status = 'failed';\n    state.error = action.error.message || 'Failed to fetch loan applications. Network unreachable.';\n  });"
  }
}
```
