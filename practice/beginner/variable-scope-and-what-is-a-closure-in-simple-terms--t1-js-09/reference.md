# Reference: What is variable scope and what is a closure in simple terms?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Scope determines the accessibility of variables in your code. JavaScript has global scope, function scope, and block scope. A **closure** is created when an inner function retains access to its outer function’s variables, even after the outer function has finished executing and returned.",
    "example": "function createCounter() {\n  let count = 0; // Private variable enclosed by closure\n  return function increment() {\n    count++;\n    return count;\n  };\n}\n\nconst counter1 = createCounter();\nconsole.log(counter1()); // 1\nconsole.log(counter1()); // 2\n// count cannot be accessed or modified directly from outside!",
    "code": "function createMultiplier(factor) {\n  return function (num) {\n    return num * factor;\n  };\n}",
    "followUp": {
      "question": "What is a practical use case for closures in day-to-day web development?",
      "expectedAnswer": "Data privacy (encapsulating private state), function factories, and callback handlers like event listeners or setTimeout."
    }
  },
  "expectedConcepts": [
    "Global scope, Function scope, and Block scope",
    "Lexical scoping (inner functions can see outer variables)",
    "Closure: A function that remembers the variables from its outer lexical scope even after that outer function has returned"
  ]
}
```
