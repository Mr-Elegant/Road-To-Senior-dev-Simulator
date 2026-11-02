# Reference: What is React and why do engineers choose it over vanilla JavaScript for building UIs?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "React is a declarative, component-based JavaScript library for building user interfaces. Instead of imperatively manipulating the browser DOM with `document.createElement()` or `innerHTML`, developers describe what the UI should look like for a given state. React uses a **Virtual DOM** in memory and an intelligent reconciliation algorithm (diffing) to calculate the minimal set of real DOM operations required, resulting in maintainable, modular, and performant web applications.",
    "example": "// Declarative: You declare state, React updates the DOM automatically\nfunction Counter() {\n  const [count, setCount] = React.useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}",
    "followUp": {
      "question": "Is React a full-fledged MVC framework or a UI library?",
      "expectedAnswer": "React is strictly a UI library focused on the \"View\" layer of an application, leaving routing, data fetching, and state management architecture up to the developer or higher-level frameworks like Next.js."
    }
  },
  "expectedConcepts": [
    "Component-based architecture",
    "Declarative UI (describe what it should look like, React handles the DOM updates)",
    "Virtual DOM and reconciliation for efficient updates",
    "Unidirectional data flow and rich ecosystem"
  ]
}
```
