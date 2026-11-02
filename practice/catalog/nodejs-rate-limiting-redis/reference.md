# Reference: Distributed Sliding Window Rate Limiter with Redis Race Conditions

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "In distributed systems, doing 'GET', evaluating the number in application memory, and then calling 'INCR' is an anti-pattern. Between the 'GET' and the 'INCR', dozens of other API server instances can execute the same 'GET' and observe the same counter value.\n      \nFix:\nUse a Redis Lua script to execute the Sliding Window Counter atomically in Redis engine memory.\nUsing Redis Sorted Sets (ZSET):\n1. Key = 'ratelimit:{apiKey}'\n2. Score & Member = Current timestamp (ms)\n3. Remove old timestamps older than (now - windowSize): 'ZREMRANGEBYSCORE key 0 (now - 60000)'\n4. Count elements in current window: 'ZCARD key'\n5. If count < limit: 'ZADD key now now', 'EXPIRE key 60', allow request.\n6. Else: Reject request with 429 Too Many Requests.",
    "codeOrArtifact": "const SLIDING_WINDOW_LUA = `\n  local key = KEYS[1]\n  local now = tonumber(ARGV[1])\n  local window = tonumber(ARGV[2])\n  local limit = tonumber(ARGV[3])\n  local clearBefore = now - window\n\n  redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)\n  local currentRequests = redis.call('ZCARD', key)\n\n  if currentRequests < limit then\n    redis.call('ZADD', key, now, now)\n    redis.call('EXPIRE', key, math.ceil(window / 1000))\n    return {1, limit - currentRequests - 1}\n  else\n    return {0, 0}\n  end\n`;\n\nclass AtomicSlidingWindowLimiter {\n  constructor(redisClient) {\n    this.redis = redisClient;\n  }\n\n  async checkLimit(apiKey, limit = 100, windowMs = 60000) {\n    const key = `rate:${apiKey}`;\n    const now = Date.now();\n    const [allowed, remaining] = await this.redis.eval(\n      SLIDING_WINDOW_LUA,\n      1,\n      key,\n      now,\n      windowMs,\n      limit\n    );\n\n    return {\n      allowed: Boolean(allowed),\n      remaining,\n    };\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-rate-limit-atomicity",
      "category": "security",
      "label": "Concurrency Atomicity & Algorithm Selection",
      "description": "Implements atomic operations via Lua script or atomic Redis commands.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Implements atomic Lua script or Sliding Window Sorted Set with complete thread safety."
        },
        {
          "score": 2,
          "description": "Uses INCR first but misses sliding window boundary edge cases."
        },
        {
          "score": 0,
          "description": "Leaves Read-Modify-Write vulnerability."
        }
      ]
    }
  ],
  "alternatives": [
    "Generic Cell Rate Algorithm (GCRA) / Leaky Bucket using Redis `redis-cell` module.",
    "Cloudflare / AWS WAF edge rate limiting."
  ],
  "commonMistakes": [
    "Using Fixed Window which allows 2x limit bursts at window boundaries (e.g. 100 requests at 0:59 and 100 requests at 1:01).",
    "Forgetting to set TTL/EXPIRE on the Redis key, leaking memory indefinitely."
  ],
  "followUps": [
    {
      "id": "node-fq-3",
      "question": "What is the memory trade-off of the Sorted Set Sliding Window algorithm vs the Sliding Window Counter algorithm?",
      "expectedConcepts": [
        "Sorted Set stores every request timestamp (high memory for high traffic)",
        "Sliding Window Counter stores 2 counters and weights them (low memory, ~O(1))"
      ],
      "sampleStrongAnswer": "The Sorted Set sliding log algorithm stores an entry for every single request in the time window, which consumes significant Redis RAM when handling millions of requests. The Sliding Window Counter algorithm (Cloudflare approach) approximates the count by storing only two integers (current minute and previous minute counters) and computing a weighted sum, reducing memory to O(1) with 99.5% accuracy."
    }
  ]
}
```
