# Reference: What is the difference between local component state and global state?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**Local component state** is data isolated to a single component or its immediate children (e.g. form input values, modal open/close toggles, hover states) and is discarded when the component unmounts. **Global state** is data shared across multiple distant components or routes (e.g. user authentication tokens, cart items, cached server data) that persists across page navigations.",
    "example": "// LOCAL STATE: Only this input box cares about what the user is currently typing\nfunction SearchBar() {\n  const [query, setQuery] = React.useState(''); // Local state\n  const dispatch = useDispatch();\n\n  const handleSearch = () => {\n    // Dispatch to GLOBAL STATE only when search is submitted\n    dispatch(setGlobalSearchFilter(query));\n  };\n  return <input value={query} onChange={e => setQuery(e.target.value)} />;\n}",
    "followUp": {
      "question": "Give an example of state that should NOT be put in Redux.",
      "expectedAnswer": "Text input typing state (on every keystroke), button hover states, or accordion expand/collapse toggles."
    }
  },
  "expectedConcepts": [
    "Local state (managed with useState/useReducer inside a single component)",
    "Global state (accessible application-wide via store)",
    "Decision criteria: Who needs the data? Does it persist across page navigation?"
  ]
}
```
