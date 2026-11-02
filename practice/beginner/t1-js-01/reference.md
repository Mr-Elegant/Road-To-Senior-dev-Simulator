# Reference: What is the difference between var, let, and const in JavaScript?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "`var` is function-scoped and can be re-declared and updated; it is hoisted with an initial value of `undefined`. `let` is block-scoped (lives only within `{ }`) and can be reassigned, but not re-declared in the same scope. `const` is also block-scoped, but cannot be reassigned after initialization. Both `let` and `const` are hoisted into a Temporal Dead Zone (TDZ), meaning accessing them before declaration throws a `ReferenceError`.",
    "example": "// var leaks out of blocks\nif (true) {\n  var x = 10;\n  let y = 20;\n}\nconsole.log(x); // 10\n// console.log(y); // ReferenceError: y is not defined\n\nconst user = { name: 'Alex' };\nuser.name = 'Sam'; // Allowed! Object properties can still be modified.\n// user = {}; // TypeError: Assignment to constant variable.",
    "code": "function initializeCounters() {\n  let count = 0;\n  const MAX_LIMIT = 10;\n  return { count, MAX_LIMIT };\n}",
    "followUp": {
      "question": "Does const make an array or object completely immutable?",
      "expectedAnswer": "No. const only prevents reassigning the variable identifier to a new memory reference. The contents or properties of the array or object can still be mutated unless Object.freeze() is used."
    }
  },
  "expectedConcepts": [
    "Scope (function-scoped vs block-scoped)",
    "Reassignment and mutability",
    "Hoisting and Temporal Dead Zone (TDZ)"
  ]
}
```
