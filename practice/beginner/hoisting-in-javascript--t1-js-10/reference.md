# Reference: What is hoisting in JavaScript?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Hoisting is JavaScript’s default behavior of moving declarations to the top of their containing scope during compilation before code executes. Function declarations are completely hoisted (callable before declaration). Variables declared with `var` are hoisted and initialized to `undefined`. Variables declared with `let` and `const` are hoisted into memory but remain uninitialized in the \"Temporal Dead Zone\" until their line of declaration is reached.",
    "example": "greet(); // Works! Outputs: \"Hello!\"\nfunction greet() {\n  console.log(\"Hello!\");\n}\n\nconsole.log(score); // undefined (var is hoisted without value)\nvar score = 100;\n\n// console.log(points); // ReferenceError: Cannot access 'points' before initialization\nlet points = 50;",
    "followUp": {
      "question": "Are function expressions (e.g. const greet = function() {}) hoisted like function declarations?",
      "expectedAnswer": "No. Only the variable identifier is hoisted (and if declared with const/let, it stays in the TDZ); the function assignment itself occurs only when that line runs."
    }
  },
  "expectedConcepts": [
    "Compilation phase moving declarations to top of scope",
    "Function declarations being fully hoisted",
    "var hoisted with undefined",
    "let and const hoisted into the Temporal Dead Zone (TDZ)"
  ]
}
```
