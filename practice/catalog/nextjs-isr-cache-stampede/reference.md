# Reference: Product Catalog High-Traffic ISR Cache Stampede / Dog-Piling

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "When a cache entry with TTL expires on a high-traffic endpoint (e.g. 10,000 requests/second), all incoming requests observe that the cache is stale at the exact same millisecond. They all initiate a cache regeneration query against the database simultaneously. This is called a Cache Stampede, Dog-Piling, or Thundering Herd.\n      \nFix:\n1. In-process: Single-flight promise deduplication. If a request for 'key' is already fetching, subsequent concurrent callers await the same promise.\n2. Across Pods: Use Redis distributed lock with 'SET lock:key value NX PX 5000'. The pod that acquires the lock regenerates the cache. Other pods receive a lock contention response, serve the stale cached version from Redis, and do not hit the database.",
    "codeOrArtifact": "const inFlightRevalidations = new Map();\n\nexport async function fetchCatalogDataDeduplicated(productId) {\n  // Check if a revalidation is already in progress in this instance\n  if (inFlightRevalidations.has(productId)) {\n    return inFlightRevalidations.get(productId);\n  }\n\n  const fetchPromise = (async () => {\n    try {\n      // In production, acquire Redis lock: SET lock:product:{id} true NX PX 5000\n      return await queryDatabase(productId);\n    } finally {\n      inFlightRevalidations.delete(productId);\n    }\n  })();\n\n  inFlightRevalidations.set(productId, fetchPromise);\n  return fetchPromise;\n}"
  },
  "rubric": [
    {
      "id": "rb-cache-stampede",
      "category": "reliability",
      "label": "Cache Stampede & Distributed Locking",
      "description": "Understands thundering herd problem and implements single-flight or distributed lock.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Implements single-flight deduplication with stale-while-revalidate semantics across cluster."
        },
        {
          "score": 2,
          "description": "Fixes single process with Promise map, but forgets multi-pod cluster coordination."
        },
        {
          "score": 0,
          "description": "Unaware of cache stampedes."
        }
      ]
    }
  ],
  "alternatives": [
    "Probabilistic early expiration (XFetch algorithm) to revalidate before the cache hard-expires.",
    "Active cron-based cache warmers instead of passive on-demand revalidation."
  ],
  "commonMistakes": [
    "Simply increasing the cache TTL: that only delays the stampede when it finally expires.",
    "Allowing multiple pods to run revalidation in parallel, wiping out the database connection pool."
  ],
  "followUps": [
    {
      "id": "next-fq-3",
      "question": "What is the XFetch probabilistic early expiration algorithm and how does it prevent stampedes?",
      "expectedConcepts": [
        "Computes probability of early refresh: delta * beta * ln(random)",
        "Refreshes proactively as expiry approaches without explicit locking"
      ],
      "sampleStrongAnswer": "The XFetch algorithm calculates a probabilistic threshold based on the computation time delta, a constant beta, and a random logarithm. As a cache entry approaches its TTL, requests have an increasing probability of triggering a background refresh before expiration. This ensures an early refresh occurs smoothly without multiple requests dog-piling."
    }
  ]
}
```
