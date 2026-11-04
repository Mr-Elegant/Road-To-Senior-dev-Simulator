# Reference: What is the difference between props and state in React?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**Props** (properties) are passed down from a parent component to a child component, behaving like read-only function arguments; a child component must never modify its received props. **State** is private, internal data managed directly by the component itself (e.g. using `useState`) that can change over user interactions. When a component’s state or received props change, React re-renders that component to update the UI.",
    "example": "// Parent passes 'initialScore' as a PROP\nfunction Game() {\n  return <ScoreBoard initialScore={0} playerName=\"Alex\" />;\n}\n\n// Child manages its own internal STATE\nfunction ScoreBoard({ initialScore, playerName }) {\n  const [score, setScore] = React.useState(initialScore);\n\n  return (\n    <div>\n      <h2>{playerName}: {score}</h2>\n      <button onClick={() => setScore(score + 1)}>+1 Point</button>\n    </div>\n  );\n}",
    "followUp": {
      "question": "What is meant by \"unidirectional data flow\" in React?",
      "expectedAnswer": "Data flows strictly downwards from parent to child via props. Child components cannot alter parent state directly; they must trigger callbacks passed down as props."
    }
  },
  "expectedConcepts": [
    "Props are external inputs passed into a component (like function arguments)",
    "Props are immutable (read-only) for the receiving component",
    "State is internal data managed within the component that changes over time",
    "Updating state triggers a component re-render"
  ]
}
```
