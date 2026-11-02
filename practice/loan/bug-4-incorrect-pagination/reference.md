# Reference: Reset pagination when the query changes

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "code": "function updateQuery(state, change) {\n  const { limit, ...patch } = change;\n  const filters = { ...state.filters, ...patch };\n  const nextLimit = limit ?? state.pagination.limit;\n  const changed = nextLimit !== state.pagination.limit || Object.keys(patch).some(key => patch[key] !== state.filters[key]);\n  return changed ? { ...state, filters, pagination: { page: 1, limit: nextLimit } } : state;\n}",
    "rootCause": "The search and filter reducer actions modify `state.filters`, but fail to reset `state.pagination.page` to 1.",
    "explanation": "Any action that narrows or alters the query criteria (`setSearchQuery`, `setStatusFilter`, `setLoanTypeFilter`, `setPageSize`) must explicitly reset `state.pagination.page = 1`.",
    "dashboardFix": "// ✅ SENIOR FIX: Explicit page reset on query/filter mutations\nsetStatusFilter: (state, action: PayloadAction<LoanStatus | 'ALL'>) => {\n  state.filters.status = action.payload;\n  state.pagination.page = 1; // Always reset pagination on filter change\n},\nsetSearchQuery: (state, action: PayloadAction<string>) => {\n  state.filters.search = action.payload;\n  state.pagination.page = 1; // Always reset pagination on search change\n},\nsetPageSize: (state, action: PayloadAction<number>) => {\n  state.pagination.limit = action.payload;\n  state.pagination.page = 1; // Prevent out-of-bounds on limit change\n}"
  }
}
```
