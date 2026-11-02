# Reference: How do you build a basic web server and define routes using Express.js?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Express.js is a minimalist web framework for Node.js. To build a server: 1) Instantiate the application with `const app = express()`, 2) Register body parsing middleware with `app.use(express.json())`, 3) Define route handlers using `app.get('/path', (req, res) => { ... })` and `app.post(...)`, and 4) Start listening for incoming network requests by calling `app.listen(port)`.",
    "example": "const express = require('express');\nconst app = express();\nconst PORT = 3000;\n\n// Enable JSON body parsing\napp.use(express.json());\n\n// GET Route\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'ok', timestamp: new Date() });\n});\n\n// POST Route\napp.post('/api/echo', (req, res) => {\n  res.json({ received: req.body });\n});\n\n// Start listening\napp.listen(PORT, () => {\n  console.log(`Server running on http://localhost:${PORT}`);\n});",
    "code": "const express = require('express');\nconst app = express();\n\napp.get('/api/ping', (req, res) => {\n  res.status(200).json({ message: 'pong' });\n});",
    "followUp": {
      "question": "What happens if you do not include app.use(express.json()) when handling a POST request with a JSON body?",
      "expectedAnswer": "req.body will be undefined, and attempting to read properties from req.body will throw an error."
    }
  },
  "expectedConcepts": [
    "Importing express and instantiating app = express()",
    "express.json() middleware for parsing JSON request bodies",
    "Defining route handlers (app.get, app.post)",
    "Starting the server with app.listen(port, callback)"
  ]
}
```
