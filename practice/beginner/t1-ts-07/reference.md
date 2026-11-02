# Reference: What are union types and how do you narrow them using typeof guards?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A union type uses the pipe operator (`|`) to allow a variable to hold values of several different types (e.g. `string | number`). Because a union could be either type, TypeScript only allows operations common to all members. To safely use type-specific methods, you perform **type narrowing** using runtime checks like `typeof`. Inside the `if` block, TypeScript automatically narrows the type.",
    "example": "function printId(id: string | number) {\n  // id.toUpperCase(); // Error! number does not have toUpperCase\n\n  // Type narrowing using typeof:\n  if (typeof id === 'string') {\n    console.log('String ID:', id.toUpperCase()); // In this block, id is string!\n  } else {\n    console.log('Numeric ID:', id.toFixed(0));   // In this block, id is number!\n  }\n}",
    "code": "function formatInput(val: string | number): string {\n  if (typeof val === 'number') {\n    return val.toFixed(2);\n  }\n  return val.trim();\n}",
    "followUp": {
      "question": "How do you narrow between two different object types in a union?",
      "expectedAnswer": "You can use the \"in\" operator (e.g. if (\"role\" in user)), instanceof for classes, or a discriminated union with a shared literal tag like kind: \"circle\"."
    }
  },
  "expectedConcepts": [
    "Union operator (|) allowing a value to be one of several types",
    "Type narrowing: TypeScript refining a broad type into a specific type based on runtime checks",
    "typeof type guards for primitives (typeof val === \"string\")",
    "Compile-time safety preventing invalid operations on unions"
  ]
}
```
