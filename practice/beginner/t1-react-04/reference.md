# Reference: How does event handling work in React, and why should you pass a function reference instead of invoking it?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "In React, event handlers use camelCase naming (`onClick`, `onChange`) and accept function references rather than strings. React wraps browser native events in a **SyntheticEvent** wrapper for consistent behavior across all browsers. You must pass a function reference (e.g. `onClick={handleClick}`) rather than calling the function immediately (`onClick={handleClick()}`); calling it immediately would execute during initial render rather than when the user clicks.",
    "example": "function ActionButton({ userId }) {\n  const handleDelete = (id) => {\n    console.log('Deleted user:', id);\n  };\n\n  // CORRECT: Passes an arrow function that calls handleDelete when clicked\n  return (\n    <button onClick={() => handleDelete(userId)}>\n      Delete User\n    </button>\n  );\n\n  // WRONG: onClick={handleDelete(userId)} would run immediately on render!\n}",
    "code": "function AlertButton({ title }) {\n  return <button onClick={() => alert(title)}>Click Me</button>;\n}",
    "followUp": {
      "question": "How do you prevent the default form submission page reload in React?",
      "expectedAnswer": "Call event.preventDefault() inside the form onSubmit handler function."
    }
  },
  "expectedConcepts": [
    "SyntheticEvent system for cross-browser normalization",
    "camelCase naming (onClick, onChange, onSubmit)",
    "Passing function reference vs immediate invocation onClick={handleClick} vs onClick={handleClick()}",
    "Passing arguments with arrow functions onClick={() => handleDelete(id)}"
  ]
}
```
