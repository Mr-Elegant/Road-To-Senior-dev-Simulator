# Reference: Keep selector results stable for unrelated updates

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "code": "function createLoanSelector() {\n  let previousItems, previousStatus, previousSearch, previousResult;\n  return state => {\n    const status = state.filters.status;\n    const search = state.filters.search.trim().toLowerCase();\n    if (state.items === previousItems && status === previousStatus && search === previousSearch) return previousResult;\n    previousItems = state.items; previousStatus = status; previousSearch = search;\n    previousResult = state.items.filter(item => (status === 'ALL' || item.status === status) && item.applicantName.toLowerCase().includes(search));\n    return previousResult;\n  };\n}",
    "rootCause": "Parent component holds the un-debounced search input in parent state and passes raw inline object callbacks (`onClick={() => handleSelect(id)}`) to child rows that lack `React.memo`. Selectors return new object references on every run.",
    "explanation": "1. Debounce the search input using a 300ms timer so Redux action is only dispatched once the user pauses.\n2. Wrap `LoanTableRow` with `React.memo` and pass stable `useCallback` action handlers.\n3. Use `createSelector` from Redux Toolkit to memoize derived state calculations.",
    "dashboardFix": "// ✅ SENIOR FIX: Debounced input + React.memo row + useCallback\nconst LoanTableRow = React.memo(({ item, onApprove, onReject, onSelect }: LoanTableRowProps) => {\n  return (\n    <tr onClick={() => onSelect(item.id)}>\n      <td>{item.applicantName}</td>\n      {/* ... */}\n    </tr>\n  );\n});\nLoanTableRow.displayName = 'LoanTableRow';\n\n// Parent uses debounced search and stable callback references\nconst handleApprove = useCallback((id: string) => {\n  dispatch(updateApplicationStatus({ id, newStatus: 'APPROVED' }));\n}, [dispatch]);"
  }
}
```
