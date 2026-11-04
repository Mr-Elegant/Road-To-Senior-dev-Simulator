# Reference: What are Promises and how does async/await make handling them easier?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "A Promise represents the eventual result of an asynchronous operation and can be in one of three states: Pending, Fulfilled, or Rejected. While Promises can be chained using `.then()` and `.catch()`, ES2017 `async/await` syntax allows asynchronous code to be written and read like standard synchronous code, using standard `try/catch` blocks for clean error handling.",
    "example": "// Using async/await\nasync function loadUserData(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}`);\n    if (!response.ok) throw new Error('Network error');\n    const user = await response.json();\n    return user;\n  } catch (error) {\n    console.error('Failed to load user:', error.message);\n  }\n}",
    "followUp": {
      "question": "What does an async function always return?",
      "expectedAnswer": "An async function always returns a Promise. If a non-promise value is returned, JavaScript automatically wraps it in a resolved Promise."
    }
  },
  "expectedConcepts": [
    "Promise states: Pending, Fulfilled, Rejected",
    "Handling with .then() and .catch()",
    "async/await syntax for writing asynchronous code that reads synchronously",
    "Error handling with try/catch"
  ]
}
```
