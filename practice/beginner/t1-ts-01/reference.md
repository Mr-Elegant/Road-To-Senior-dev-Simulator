# Reference: What is TypeScript and what primary advantages does it offer over vanilla JavaScript?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "TypeScript is a statically typed superset of JavaScript developed by Microsoft that adds optional static typing. It compiles into standard JavaScript that any browser or Node runtime can execute. Its primary advantages are: catching type errors during development before code runs in production, providing rich IDE code completion and instant refactoring, and acting as living self-documentation for function signatures and API responses.",
    "example": "// Vanilla JS: Silently fails or concatenates strings unexpectedly\n// function add(a, b) { return a + b; }\n// add(5, \"10\") -> \"510\" (Bug!)\n\n// TypeScript: Catches error immediately in editor\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n// add(5, \"10\"); // TS2345: Argument of type 'string' is not assignable to 'number'",
    "followUp": {
      "question": "Do TypeScript types exist at runtime in the browser?",
      "expectedAnswer": "No. TypeScript types are completely erased during compilation. At runtime, the browser executes only pure JavaScript."
    }
  },
  "expectedConcepts": [
    "Typed superset of JavaScript compiling to plain JavaScript",
    "Compile-time error detection (catching bugs before running code)",
    "Rich IDE auto-completion and intelligent refactoring",
    "Self-documenting code with clear contracts and interfaces"
  ]
}
```
