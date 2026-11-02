# Reference: How do you render lists in React, and why is the key prop strictly necessary?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Lists are rendered in React by mapping over arrays with `.map()` and returning JSX elements. Every list item requires a unique, stable `key` prop (such as an item ID from a database). React uses this `key` during its reconciliation process to identify which items have changed, been added, or been removed. Using array indices as keys is discouraged because reordering, deleting, or inserting items changes their index, leading to UI rendering bugs and state mismatches.",
    "example": "function TodoList({ todos }) {\n  return (\n    <ul>\n      {todos.map((todo) => (\n        // Good: Unique, stable ID used as key\n        <li key={todo.id} className={todo.completed ? 'done' : ''}>\n          {todo.text}\n        </li>\n      ))}\n    </ul>\n  );\n}",
    "code": "function ProductList({ products }) {\n  return (\n    <ul>\n      {products.map((p) => (\n        <li key={p.id}>{p.name}</li>\n      ))}\n    </ul>\n  );\n}",
    "followUp": {
      "question": "Is it ever acceptable to use the array index as a key?",
      "expectedAnswer": "Only if the list is strictly static (never filtered, sorted, added to, or deleted from) and items have no unique IDs."
    }
  },
  "expectedConcepts": [
    "Array.prototype.map() to transform data into JSX elements",
    "Unique key prop requirement for reconciliation",
    "How React uses keys to track item additions, removals, and reordering",
    "Why using array index as key is an anti-pattern for dynamic lists"
  ]
}
```
