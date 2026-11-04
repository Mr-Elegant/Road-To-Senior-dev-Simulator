# Reference: How does the JavaScript event loop work in simple terms?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "JavaScript is single-threaded, meaning it can only execute one command at a time on its **Call Stack**. When asynchronous tasks like `setTimeout` or `fetch` are initiated, they are offloaded to background browser APIs. Once complete, their callbacks enter the **Task Queue**. The **Event Loop** continuously monitors the Call Stack; as soon as the Call Stack is completely empty, it pushes the first waiting callback from the Queue onto the stack.",
    "example": "console.log('1');\n\nsetTimeout(() => {\n  console.log('2');\n}, 0);\n\nconsole.log('3');\n\n// Output order: 1, 3, 2\n// Explanation: Even with 0ms delay, the setTimeout callback must wait in the Task Queue until synchronous code (1 and 3) finishes executing.",
    "followUp": {
      "question": "Why does setTimeout with 0ms delay not execute immediately before the next line?",
      "expectedAnswer": "Because setTimeout is asynchronous; its callback is queued in the task queue and the event loop will only execute queued tasks after the main call stack is cleared."
    }
  },
  "expectedConcepts": [
    "Single-threaded execution",
    "Call Stack (current execution)",
    "Web APIs / Background handlers (timers, fetch)",
    "Task Queue / Callback Queue waiting for stack to clear"
  ]
}
```
