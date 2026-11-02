# Reference: What is JSX and what are its key syntax rules in React?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "JSX stands for JavaScript XML. It is a syntax extension that lets you write HTML-like structures directly inside JavaScript files. Browsers cannot execute JSX directly; tools like Babel/SWC compile JSX into standard `React.createElement()` calls. Key rules include: components must return a single root element (or Fragment `<>`), standard HTML attributes like `class` become `className` (because `class` is a reserved JS keyword), all tags must be self-closed, and JavaScript expressions are evaluated inside curly braces `{}`.",
    "example": "function UserCard({ name, avatarUrl, unreadCount }) {\n  return (\n    <div className=\"user-card\">\n      <img src={avatarUrl} alt={name} />\n      <h3>{name.toUpperCase()}</h3>\n      <p>Messages: {unreadCount > 0 ? unreadCount : 'None'}</p>\n    </div>\n  );\n}",
    "code": "function Badge({ label }) {\n  return (\n    <>\n      <span className=\"badge\">{label}</span>\n      <img src=\"icon.png\" alt=\"icon\" />\n    </>\n  );\n}",
    "followUp": {
      "question": "Can you write an if-statement or for-loop directly inside JSX curly braces {}?",
      "expectedAnswer": "No, JSX curly braces can only accept expressions that evaluate to a value (such as ternaries, map(), or variables), not statements like if/else or for loops."
    }
  },
  "expectedConcepts": [
    "JavaScript XML: Syntax extension for JavaScript",
    "Transpilation to React.createElement() calls",
    "Single root element requirement (or React.Fragment / <>)",
    "className instead of class, htmlFor instead of for",
    "Curly braces {} for embedding JS expressions",
    "All tags must be explicitly closed (including <img /> and <input />)"
  ]
}
```
