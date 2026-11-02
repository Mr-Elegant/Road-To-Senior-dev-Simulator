# Reference: Sort loans without mutating Redux state

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "code": "function sortLoans(items, sorting) {\n  return [...items].sort((a, b) => {\n    const left = a[sorting.field], right = b[sorting.field];\n    const result = left === right ? 0 : left < right ? -1 : 1;\n    return sorting.order === 'asc' ? result : -result;\n  });\n}",
    "rootCause": "Array prototype methods like `.sort()`, `.reverse()`, and `.splice()` mutate arrays in place. In Redux Toolkit reducers, mixing `return newState` with direct mutations confuses Immer draft finalization.",
    "explanation": "Either mutate the Immer draft directly without returning, or return a complete new state object. When sorting or filtering arrays in reducers or selectors, always copy first (`[...state.items].sort(...)`).",
    "dashboardFix": "// ✅ SENIOR FIX: Immutable copy in selectors & clean Immer draft usage\nexport const selectSortedApplications = createSelector(\n  [(state: RootState) => state.applications.items, (state: RootState) => state.applications.sorting],\n  (items, sorting) => {\n    // Clone array before sorting to avoid mutating state\n    return [...items].sort((a, b) => {\n      const aVal = a[sorting.field];\n      const bVal = b[sorting.field];\n      return sorting.order === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);\n    });\n  }\n);"
  }
}
```
