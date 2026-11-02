# Reference: Third-Party Shipping API Retry Storm & Thundering Herd Incident

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "When hundreds or thousands of clients encounter an API outage or rate limit (HTTP 429 / 503), retrying after a fixed duration (e.g. 2s) causes all clients to hammer the destination API at the exact same millisecond. This creates a synchronized periodic wave of traffic known as a Retry Storm or Thundering Herd.\n      \nFix: Exponential Backoff with Full Jitter (AWS Best Practice):\n1. Base Backoff: Exponentially increase wait time with each attempt: base * (2 ^ attempt).\n2. Cap: Bound the maximum wait time (e.g. max 30 seconds).\n3. Full Jitter: Sleep for a uniform random duration between 0 and the exponential cap:\n   'sleep = Math.random() * Math.min(cap, base * (2 ** attempt))'\nThis spreads the retries across a smooth continuous time interval, allowing the upstream service to recover gradually.\n4. Retry-After Header: If the API returns a 'Retry-After: 30' header, always honor the upstream service's explicit request.",
    "codeOrArtifact": "async function fetchWithFullJitter(fetchFn, maxRetries = 5, baseMs = 500, capMs = 20000) {\n  let attempt = 0;\n\n  while (attempt < maxRetries) {\n    try {\n      return await fetchFn();\n    } catch (err) {\n      attempt++;\n      if (attempt >= maxRetries) throw err;\n\n      // Check for upstream Retry-After header (seconds)\n      const retryAfterHeader = err.response?.headers?.['retry-after'];\n      let delayMs;\n\n      if (retryAfterHeader) {\n        const seconds = parseInt(retryAfterHeader, 10);\n        delayMs = (!isNaN(seconds) ? seconds * 1000 : baseMs) + Math.random() * 500;\n      } else {\n        // Exponential Backoff with Full Jitter\n        const exponentialMax = Math.min(capMs, baseMs * Math.pow(2, attempt));\n        delayMs = Math.floor(Math.random() * exponentialMax);\n      }\n\n      console.warn(`Attempt ${attempt} failed. Retrying in ${delayMs}ms...`);\n      await new Promise((resolve) => setTimeout(resolve, delayMs));\n    }\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-jitter",
      "category": "reliability",
      "label": "Exponential Backoff & Jitter Mathematics",
      "description": "Implements full jitter algorithm and respects Retry-After headers.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Implements full jitter formula, parses Retry-After header, sets max cap."
        },
        {
          "score": 2,
          "description": "Uses exponential backoff but forgets random jitter."
        },
        {
          "score": 0,
          "description": "Linear fixed retry."
        }
      ]
    }
  ],
  "alternatives": [
    "Decorrelated Jitter: `sleep = Math.min(cap, Math.random() * (sleep * 3 - base) + base)`."
  ],
  "commonMistakes": [
    "Equal Jitter: `delay = half + Math.random() * half` still maintains a synchronized lower bound.",
    "Retrying non-retryable 4xx client errors (e.g. 401 Unauthorized, 404 Not Found), wasting requests."
  ],
  "followUps": [
    {
      "id": "integ-fq-4",
      "question": "Which HTTP status codes should you retry, and which should you NEVER retry?",
      "expectedConcepts": [
        "Retry: 429 (Rate Limit), 503 (Service Unavailable), 504 (Gateway Timeout), Network errors",
        "Do NOT retry: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 422"
      ],
      "sampleStrongAnswer": "You should only retry transient errors: HTTP 429 (Too Many Requests), 502/503/504 (Gateway and Service Unavailable), and socket timeouts. You should never retry deterministic client errors: 400, 401, 403, 404, or 422, because repeating an invalid request with bad data will produce the exact same failure and waste server resources."
    }
  ]
}
```
