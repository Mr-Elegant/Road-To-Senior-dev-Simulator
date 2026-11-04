# Reference: What is the difference between a regular function and an arrow function?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Regular functions (`function foo() {}`) have their own dynamic `this` context determined by how the function is invoked, provide access to the `arguments` object, and can be used as constructors with `new`. Arrow functions (`() => {}`) have shorter syntax, implicit return for single expressions, and inherit `this` lexically from their enclosing scope. Arrow functions cannot be used with `new` and do not have their own `arguments` object.",
    "example": "const timer = {\n  seconds: 0,\n  start() {\n    // Arrow function retains 'this' pointing to timer object\n    setInterval(() => {\n      this.seconds++;\n      console.log(this.seconds);\n    }, 1000);\n  }\n};",
    "code": "const double = (n) => n * 2;",
    "followUp": {
      "question": "Can you use an arrow function as an object method if it needs to access this.property?",
      "expectedAnswer": "Usually no, because the arrow function will lexically bind this to the surrounding scope (e.g. window or module) rather than the object itself."
    }
  },
  "expectedConcepts": [
    "Syntax brevity and implicit return",
    "Lexical this binding vs dynamic this",
    "arguments object availability",
    "Constructor usage (arrow functions cannot be used with new)"
  ]
}
```
