# Reference: How does the useState hook work, and when should you use a functional state update?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`useState` is a React Hook that declares a state variable in a functional component, returning a pair: the current state value and an updater function. When an update depends on the previous state value, you should pass an updater callback (`setCount(prev => prev + 1)`). This guarantees you are calculating from the most current state, avoiding stale state bugs caused by React’s asynchronous batching.",
    "example": "function Counter() {\n  const [count, setCount] = React.useState(0);\n\n  const incrementThreeTimes = () => {\n    // If you wrote setCount(count + 1) three times, count would only increase by 1!\n    // Functional updates guarantee each update receives the latest calculated value:\n    setCount(prev => prev + 1);\n    setCount(prev => prev + 1);\n    setCount(prev => prev + 1); // Increases count by 3\n  };\n\n  return <button onClick={incrementThreeTimes}>Count: {count}</button>;\n}",
    "code": "function SimpleCounter() {\n  const [count, setCount] = React.useState(0);\n  return (\n    <div>\n      <span data-testid=\"count\">{count}</span>\n      <button onClick={() => setCount(prev => prev + 1)}>Increment</button>\n      <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>\n    </div>\n  );\n}",
    "followUp": {
      "question": "How do you update an object stored in useState without losing its other properties?",
      "expectedAnswer": "Use the spread operator: setUser(prev => ({ ...prev, name: \"New Name\" })). Never mutate user.name directly."
    }
  },
  "expectedConcepts": [
    "Declaring state with const [state, setState] = useState(initialValue)",
    "Asynchronous batching of state updates",
    "Functional update pattern setState(prev => prev + 1) for state depending on previous value",
    "Immutability: Always creating new objects/arrays instead of mutating existing state"
  ]
}
```
