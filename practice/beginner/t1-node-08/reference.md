# Reference: What is Express middleware and what is the role of the next() function?

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Middleware functions in Express are functions that have access to the `req` (request) object, the `res` (response) object, and the `next` function in the application’s request-response cycle. Middleware can run code, modify request/response objects, end the request by sending a response, or call `next()` to pass control to the next middleware in line. If a middleware neither ends the response nor calls `next()`, the client request will hang indefinitely.",
    "example": "// Custom logging middleware:\nconst loggerMiddleware = (req, res, next) => {\n  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);\n  next(); // Hands off control to the next handler\n};\n\napp.use(loggerMiddleware);\n\n// Authentication guard middleware:\nconst requireAuth = (req, res, next) => {\n  const authHeader = req.headers['authorization'];\n  if (!authHeader) {\n    return res.status(401).json({ error: 'Access token required' }); // Halts pipeline\n  }\n  next(); // User is authenticated, proceed to route\n};\n\napp.get('/api/dashboard', requireAuth, (req, res) => {\n  res.json({ secretData: 'Confidential stats' });\n});",
    "followUp": {
      "question": "What happens if you pass an argument to next(err)?",
      "expectedAnswer": "Express recognizes any argument passed to next() as an error and skips all remaining normal routes to jump straight to the designated error-handling middleware."
    }
  },
  "expectedConcepts": [
    "Middleware function signature (req, res, next)",
    "Pipeline execution order in Express",
    "Calling next() to pass control to the subsequent middleware or route handler",
    "Ending the request-response cycle (sending response or returning error)",
    "Common uses: Logging, authentication checks, request validation, CORS"
  ]
}
```
