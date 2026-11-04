# Reference: How does parent-to-child and child-to-parent communication work in React?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Communication in React follows unidirectional data flow: 1) **Parent to child**: The parent passes data downwards directly via `props`. 2) **Child to parent**: The parent defines a callback function and passes it as a prop to the child; when an event occurs, the child calls this callback and passes data back up as arguments. If two sibling components need to share data, you **lift the state up** to their closest common parent.",
    "example": "// Parent component holds state and defines callback\nfunction Parent() {\n  const [theme, setTheme] = React.useState('light');\n\n  return (\n    <div className={theme}>\n      {/* Passing callback down to child */}\n      <ThemeToggle onToggleTheme={(newTheme) => setTheme(newTheme)} />\n    </div>\n  );\n}\n\n// Child calls callback to send info upwards\nfunction ThemeToggle({ onToggleTheme }) {\n  return (\n    <button onClick={() => onToggleTheme('dark')}>\n      Switch to Dark Mode\n    </button>\n  );\n}",
    "followUp": {
      "question": "What is \"prop drilling\" and how do developers solve it when components are deeply nested?",
      "expectedAnswer": "Prop drilling occurs when props are passed through many intermediate components that do not need them just to reach a deep child. It is solved using React Context or global state managers like Redux Toolkit."
    }
  },
  "expectedConcepts": [
    "Parent to child: Passing data/props down",
    "Child to parent: Passing callback functions down, which child invokes with data",
    "Lifting state up to the closest common ancestor"
  ]
}
```
