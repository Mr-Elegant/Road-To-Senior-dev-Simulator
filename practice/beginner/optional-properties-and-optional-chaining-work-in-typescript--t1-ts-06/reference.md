# Reference: How do optional properties (?) and optional chaining (?.) work in TypeScript?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "An optional property is marked with a question mark (`?`) in an interface or type (`email?: string`), meaning objects are allowed to omit that property; its type becomes `string | undefined`. When accessing deeply nested properties that might be undefined, the **optional chaining operator** (`?.`) safely stops evaluation and returns `undefined` if the reference is nullish, preventing runtime crashes.",
    "example": "interface UserProfile {\n  id: string;\n  name: string;\n  bio?: string; // Optional property\n  address?: {\n    city?: string;\n  };\n}\n\nconst user: UserProfile = { id: 'u1', name: 'Alex' }; // Valid! bio and address omitted\n\n// Optional chaining safely evaluates without throwing errors:\nconst city = user.address?.city ?? 'Unknown City';\nconsole.log(city); // 'Unknown City'",
    "followUp": {
      "question": "Can you use optional chaining with function calls?",
      "expectedAnswer": "Yes! You can write onComplete?.() which will only call the function if onComplete is not null or undefined."
    }
  },
  "expectedConcepts": [
    "Optional property syntax (property?: type in interfaces)",
    "How optional properties equate to type | undefined",
    "Optional chaining operator (?.) preventing \"cannot read property of undefined\" errors at runtime",
    "Nullish coalescing operator (??) for default fallbacks"
  ]
}
```
