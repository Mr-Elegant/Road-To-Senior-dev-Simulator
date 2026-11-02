# Reference: What are the basic primitive types in TypeScript and how do type annotations work?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "TypeScript’s primitive types mirror JavaScript primitives: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, and `bigint`. You provide explicit type annotations using the colon syntax (`let age: number = 25`). However, TypeScript has powerful **type inference**, meaning if you assign a value immediately, TypeScript automatically infers the correct type without requiring redundant annotations.",
    "example": "let username: string = 'Alex';\nlet score: number = 95.5;\nlet isCompleted: boolean = false;\n\n// Type Inference (explicit annotation is optional here)\nlet city = 'Seattle'; // Inferred as string\n// city = 42; // Error: Type 'number' is not assignable to type 'string'.",
    "code": "function calculateTotal(price: number, quantity: number): number {\n  return price * quantity;\n}",
    "followUp": {
      "question": "Does TypeScript differentiate between integers and floating point numbers?",
      "expectedAnswer": "No, just like JavaScript, all numbers in TypeScript are of type number (double-precision 64-bit float)."
    }
  },
  "expectedConcepts": [
    "string, number, boolean, null, undefined, symbol, bigint",
    "Type annotations using colon syntax (let name: string = \"Alice\")",
    "Type inference (TypeScript automatically inferring types without explicit annotations)"
  ]
}
```
