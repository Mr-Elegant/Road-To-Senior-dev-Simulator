# Reference: Background Reconciliation Pipeline Unhandled Rejection Crash

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "In JavaScript, 'Array.prototype.forEach' expects a synchronous callback. When you pass an async function to forEach, it executes the async function, receives a Promise, and discards it immediately. It neither awaits them nor captures rejections. As a result, 'processInvoices' returns an empty array before any charge finishes, and any rejected promise becomes an UnhandledPromiseRejection.\n      \nFix:\nUse 'Promise.allSettled(invoices.map(...))'. This guarantees every promise runs to completion. We then separate 'fulfilled' results from 'rejected' results and return a structured report.",
    "codeOrArtifact": "async function processInvoices(invoices, billingService) {\n  const settled = await Promise.allSettled(\n    invoices.map(async (inv) => {\n      try {\n        const receipt = await billingService.charge(inv);\n        return { invoiceId: inv.id, receipt };\n      } catch (err) {\n        throw { invoiceId: inv.id, message: err.message || 'Billing failed' };\n      }\n    })\n  );\n\n  const succeeded = [];\n  const failed = [];\n\n  for (const item of settled) {\n    if (item.status === 'fulfilled') {\n      succeeded.push(item.value);\n    } else {\n      failed.push(item.reason);\n    }\n  }\n\n  return {\n    succeededCount: succeeded.length,\n    failedCount: failed.length,\n    succeeded,\n    failed,\n  };\n}"
  },
  "rubric": [
    {
      "id": "rb-async-await-loop",
      "category": "correctness",
      "label": "Asynchronous Iteration Mechanics",
      "description": "Understands why forEach cannot be used with async/await and uses proper iteration.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Correctly replaces forEach with Promise.allSettled() or for-of with try/catch."
        },
        {
          "score": 2,
          "description": "Uses Promise.all() which still short-circuits on first error."
        },
        {
          "score": 1,
          "description": "Attempts to use async in map() without awaiting Promise.all."
        },
        {
          "score": 0,
          "description": "Leaves forEach intact."
        }
      ]
    },
    {
      "id": "rb-error-resilience",
      "category": "reliability",
      "label": "Failure Isolation and Error Reporting",
      "description": "Extracts error reasons and isolates failures from halting the batch.",
      "weight": 4,
      "levels": [
        {
          "score": 3,
          "description": "Captures each failing item, maps error message, and produces comprehensive report."
        },
        {
          "score": 2,
          "description": "Catches error but ignores error metadata."
        },
        {
          "score": 0,
          "description": "Errors crash the routine."
        }
      ]
    }
  ],
  "alternatives": [
    "Sequential for-await-of loop with try/catch block if rate limits mandate serial execution.",
    "Worker pool (e.g. p-limit or p-map) with concurrency of 10 to protect external billing gateway from rate limits."
  ],
  "commonMistakes": [
    "Using Promise.all() thinking it solves error handling; Promise.all fails fast on the very first rejection and aborts reporting on remaining items.",
    "Putting try/catch around forEach: the synchronous try/catch finishes before the async promises even resolve."
  ],
  "followUps": [
    {
      "id": "js-fq-4",
      "question": "What is the default Node.js behavior when an unhandledRejection occurs in modern Node (v16+)?",
      "expectedConcepts": [
        "Process exits with non-zero exit code (code 1)",
        "Changed from warning to fatal crash to prevent corrupt state"
      ],
      "sampleStrongAnswer": "In Node.js 15+, unhandled rejections terminate the process with exit code 1 by default (unhandled-rejections=throw). Previously it only printed a warning. This prevents applications from continuing in an undefined, corrupted state."
    }
  ]
}
```
