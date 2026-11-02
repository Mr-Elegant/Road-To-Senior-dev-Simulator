# Reference: Express Asynchronous Error Swallowing & Hanging Socket Leak

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "In Express 4, route handlers were designed around the traditional callback pattern (err, result). When you pass an 'async (req, res, next)' function to Express 4, Express executes it synchronously and ignores the returned Promise. If an exception is thrown after an 'await', the promise rejects. Because nothing catches the promise rejection, 'next(err)' is never called, and 'res.send()' is never executed. The client TCP connection remains open until timeout.\n      \nFix:\nWrap async handlers in an 'asyncHandler' utility:\n'const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);'\nOr upgrade to Express 5, where route handlers automatically forward rejected promises to 'next(err)'.",
    "codeOrArtifact": "/**\n * Higher-order utility wrapping async handlers to forward rejections to next(err)\n */\nexport const asyncHandler = (fn) => (req, res, next) => {\n  Promise.resolve(fn(req, res, next)).catch(next);\n};\n\n// Usage:\n// app.post('/api/inventory/update', asyncHandler(async (req, res) => {\n//   const result = await db.updateInventory(req.body);\n//   res.json({ success: true, result });\n// }));"
  },
  "rubric": [
    {
      "id": "rb-async-handler",
      "category": "reliability",
      "label": "Express Async Error Handling Mechanics",
      "description": "Implements asyncHandler wrapper or Express 5 upgrade to guarantee catch(next).",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Writes robust asyncHandler wrapper, explains Express 4 vs 5 difference and socket leak risk."
        },
        {
          "score": 2,
          "description": "Adds try/catch inside individual route but does not create reusable middleware pattern."
        },
        {
          "score": 0,
          "description": "Fails to address async rejection."
        }
      ]
    }
  ],
  "alternatives": [
    "Upgrading to Express 5 or migrating to Fastify / Koa (which have native promise support).",
    "Using `express-async-errors` package (monkey-patches Layer.prototype.handle_request)."
  ],
  "commonMistakes": [
    "Writing manual try/catch in every single route handler (repetitive and prone to human omission).",
    "Placing the 4-argument error middleware `(err, req, res, next)` BEFORE route definitions (it must be registered last)."
  ],
  "followUps": [
    {
      "id": "node-fq-2",
      "question": "Why must Express error-handling middleware have exactly 4 arguments `(err, req, res, next)`?",
      "expectedConcepts": [
        "Function.prototype.length reflection",
        "Express checks handler.length === 4 to distinguish error handlers"
      ],
      "sampleStrongAnswer": "Express inspects the arity of the middleware function using `fn.length`. If `fn.length === 4`, Express treats it as an error-handling middleware. If you omit the `next` argument and write `(err, req, res)`, `fn.length` is 3, and Express mistakenly treats it as standard middleware and skips it when errors occur."
    }
  ]
}
```
