# Reference: What is Node.js and how does running JavaScript in Node differ from running it in a web browser?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Node.js is an open-source, cross-platform JavaScript runtime built on Google Chrome’s V8 engine that allows JavaScript to be executed on a server or computer outside of a browser. In a browser, JavaScript is sandboxed to manipulate web pages (via `window`, `document`, and the DOM) without direct file system access. In Node.js, there is no DOM or `window` object; instead, Node provides APIs to interact directly with the operating system, access files (`fs`), create web servers (`http`), and manage system processes (`process`).",
    "example": "// Browser JavaScript:\n// document.getElementById('btn').addEventListener('click', ...);\n\n// Node.js Server JavaScript:\nconst fs = require('fs');\nconst http = require('http');\n\n// Read a file from the server's hard drive:\nconst serverConfig = fs.readFileSync('config.json', 'utf8');\n\n// Create an HTTP server listening on port 8080:\nconst server = http.createServer((req, res) => {\n  res.end('Hello from Node.js server!');\n});\nserver.listen(8080);",
    "followUp": {
      "question": "What is npm in the Node.js ecosystem?",
      "expectedAnswer": "npm (Node Package Manager) is the default package manager for Node.js, used to install, share, and manage open-source third-party libraries and project dependencies."
    }
  },
  "expectedConcepts": [
    "V8 JavaScript engine executing outside the browser",
    "No browser DOM, window, or document objects",
    "Access to server-side operating system APIs (file system fs, networking http, process)",
    "Global object (global instead of window)"
  ]
}
```
