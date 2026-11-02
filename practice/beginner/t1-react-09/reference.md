# Reference: What is a controlled component in React and how does it handle form inputs?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A **controlled component** is an input form element whose current value is driven by React state rather than the browser DOM. The component specifies `value={state}` and an `onChange={(e) => setState(e.target.value)}` handler. This establishes React state as the single source of truth, making input validation, formatting, disabling buttons, and clearing fields straightforward.",
    "example": "function SearchInput() {\n  const [query, setQuery] = React.useState('');\n\n  return (\n    <input\n      type=\"text\"\n      value={query} // React controls the value\n      onChange={(e) => setQuery(e.target.value)} // State updates on user keystroke\n      placeholder=\"Search challenges...\"\n    />\n  );\n}",
    "code": "function GreetingForm() {\n  const [name, setName] = React.useState('');\n  return (\n    <div>\n      <input\n        type=\"text\"\n        value={name}\n        onChange={(e) => setName(e.target.value)}\n        placeholder=\"Enter your name\"\n      />\n      <p>Hello, {name || 'stranger'}!</p>\n    </div>\n  );\n}",
    "followUp": {
      "question": "What warning does React give if an input starts with value={undefined} and later receives a string?",
      "expectedAnswer": "A warning stating \"A component is changing an uncontrolled input to be controlled\". Always initialize state with an empty string \"\" instead of undefined."
    }
  },
  "expectedConcepts": [
    "Input value is driven by React state (value={text})",
    "Input updates via onChange handler (onChange={e => setText(e.target.value)})",
    "Single source of truth in React state rather than the DOM",
    "Comparison with uncontrolled components (using refs)"
  ]
}
```
