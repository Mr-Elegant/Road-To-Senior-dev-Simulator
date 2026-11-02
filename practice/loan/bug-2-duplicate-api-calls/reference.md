# Reference: Admit distinct queries, suppress duplicate in-flight work

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "code": "function shouldFetch(active, next) {\n  if (!active || active.status !== 'loading') return true;\n  return ['search', 'status', 'page', 'limit'].some(key => active.query[key] !== next[key]);\n}",
    "rootCause": "`useEffect` dependency arrays include unmemoized object literals or functions (e.g. `[filters, pagination]`), triggering repeated execution on every render cycle even when actual property values have not changed.",
    "explanation": "1. Normalize dependency primitives (e.g., `filters.search, filters.status, pagination.page, pagination.limit`) or use custom deep-equality comparisons.\n2. In Redux thunks, leverage the `condition` option in `createAsyncThunk(type, payloadCreator, { condition: (arg, { getState }) => !isCurrentlyLoading })` to suppress duplicate in-flight dispatches.",
    "dashboardFix": "// ✅ SENIOR FIX: Specific primitive dependencies + thunk condition guard\nexport const fetchApplications = createAsyncThunk(\n  'applications/fetch',\n  async (params: LoanFilters, { signal }) => {\n    return await loanService.getApplications(params, { signal });\n  },\n  {\n    // Suppress the same query, while still admitting a different latest query.\n    condition: (next, { getState }) => {\n      const { applications } = getState() as RootState;\n      const key = JSON.stringify([next.search, next.status, next.page, next.limit]);\n      return applications.status !== 'loading' || applications.activeQueryKey !== key;\n    },\n  }\n);\n\n// Component: use individual stable primitive keys\n// In the slice's pending handler, record the dispatched query key:\nbuilder.addCase(fetchApplications.pending, (state, action) => {\n  const query = action.meta.arg;\n  state.status = 'loading';\n  state.activeQueryKey = JSON.stringify([query.search, query.status, query.page, query.limit]);\n});\n\nuseEffect(() => {\n  dispatch(fetchApplications({ search, status, page, limit }));\n}, [dispatch, search, status, page, limit]);"
  }
}
```
