# Reference: What is the difference between any and unknown in TypeScript and why is unknown safer?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`any` turns off TypeScript’s type checking completely; you can access any property, call it as a function, and assign it anywhere, losing all type safety. In contrast, `unknown` represents a value whose type is not yet known (such as an API response). Unlike `any`, TypeScript strictly forbids you from accessing properties or calling an `unknown` variable until you explicitly narrow its type using runtime checks (`typeof`, `instanceof`), ensuring type safety.",
    "example": "let valAny: any = \"hello\";\nvalAny.nonExistentMethod(); // Compiles fine, crashes at runtime!\n\nlet valUnknown: unknown = \"hello\";\n// valUnknown.toUpperCase(); // Error: 'valUnknown' is of type 'unknown'.\n\n// Must narrow first:\nif (typeof valUnknown === 'string') {\n  console.log(valUnknown.toUpperCase()); // Safe and allowed!\n}",
    "followUp": {
      "question": "When should you use unknown instead of any?",
      "expectedAnswer": "Whenever handling external, unvalidated data like JSON.parse() results or third-party API payloads, use unknown so your code is forced to validate fields before use."
    }
  },
  "expectedConcepts": [
    "any disables all type checking (escape hatch back to unchecked JavaScript)",
    "unknown represents any value but forbids operations until narrowed",
    "Type-safety: unknown forces developers to verify the type before accessing methods or properties"
  ]
}
```
