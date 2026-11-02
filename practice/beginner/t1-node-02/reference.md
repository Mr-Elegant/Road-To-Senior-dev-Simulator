# Reference: What is meant by the "non-blocking, event-driven I/O" model in Node.js?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "In traditional multi-threaded servers, each client connection spawns a new thread that blocks (pauses) while waiting for disk or database operations to finish. Node.js uses a single main thread with **non-blocking asynchronous I/O**. When Node performs a file read or database query, it sends the task to the underlying operating system and immediately continues processing other incoming requests. When the I/O task completes, Node is notified via an event and triggers the callback or resolves the Promise.",
    "example": "console.log('1. Server ready to accept requests');\n\n// Asynchronous / Non-blocking file read\nfs.readFile('large_dataset.csv', 'utf8', (err, data) => {\n  console.log('3. File finished reading in background');\n});\n\nconsole.log('2. Server can handle user login while file is still reading!');\n// Output order: 1, 2, 3",
    "followUp": {
      "question": "What happens if you execute a heavy CPU calculation (like a loop with 10 billion cycles) in Node.js?",
      "expectedAnswer": "Because the main thread is single-threaded, heavy synchronous CPU work blocks the event loop, freezing the server and preventing all other users from receiving responses until it finishes."
    }
  },
  "expectedConcepts": [
    "Single-threaded execution for JavaScript code",
    "Non-blocking I/O (Input/Output like disk reading or network requests do not pause the server)",
    "Callbacks and Promises when background operations finish",
    "Efficiency in handling many concurrent connections with low memory footprint"
  ]
}
```
