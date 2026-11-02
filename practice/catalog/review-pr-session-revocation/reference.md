# Reference: Code Review PR #589: Distributed Redis Session Invalidation

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Code Review Findings:\n1. [FATAL OPERATIONAL HAZARD] Synchronous 'redis.keys()' Command Freezes Production Redis (Line 16)\nRedis executes commands on a single thread. The 'KEYS' command inspects every single key in the entire Redis keyspace in O(N) time. In a production database with millions of keys, 'redis.keys()' will freeze Redis for 3 to 10 seconds. During this freeze, all other health checks, cache lookups, and session validations fail, crashing the entire web platform.\nFix: Never use 'KEYS' in production. Instead, maintain an explicit index using a Redis Set: 'user_sessions:{userId}'.\n\n2. [CRITICAL MEMORY LEAK] Missing TTL on Session Keys (Line 8)\n'redis.set(`session:${userId}:${token}`, ...)' creates a key with no expiration (TTL = -1). Over months of user logins, millions of expired tokens remain in Redis RAM permanently until Redis reaches 'maxmemory' and starts evicting or crashing.\nFix: Pass 'EX' (seconds) or 'PX' matching the JWT token's lifespan (e.g. 7 days = 604800 seconds).\n\n3. [CLEAN ARCHITECTURAL FIX] Index Sessions in a Redis Set:\nWhen creating a session:\n'MULTI'\n'SET session:{token} {claims} EX 604800'\n'SADD user_sessions:{userId} {token}'\n'EXPIRE user_sessions:{userId} 604800'\n'EXEC'\nWhen revoking all user sessions:\nRetrieve all tokens with 'SMEMBERS user_sessions:{userId}' in O(1) and delete them.",
    "codeOrArtifact": "class RobustSessionStore {\n  async createSession(userId, token, claims, ttlSeconds = 604800) {\n    const pipeline = redis.pipeline();\n    pipeline.set(`session:${token}`, JSON.stringify(claims), 'EX', ttlSeconds);\n    pipeline.sadd(`user_sessions:${userId}`, token);\n    pipeline.expire(`user_sessions:${userId}`, ttlSeconds);\n    await pipeline.exec();\n    return true;\n  }\n\n  async revokeAllUserSessions(userId) {\n    const setKey = `user_sessions:${userId}`;\n    const tokens = await redis.smembers(setKey);\n    if (tokens.length === 0) return 0;\n\n    const pipeline = redis.pipeline();\n    tokens.forEach((token) => pipeline.del(`session:${token}`));\n    pipeline.del(setKey);\n    await pipeline.exec();\n\n    return tokens.length;\n  }\n\n  async isSessionValid(token) {\n    return Boolean(await redis.exists(`session:${token}`));\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-cr-redis-keys",
      "category": "reliability",
      "label": "Redis Blocking Command Detection",
      "description": "Identifies production hazard of KEYS command and prescribes SCAN or Set indexing.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Calls out KEYS freezing Redis single-thread, proposes Set-based session index or SCAN."
        },
        {
          "score": 1,
          "description": "Notes performance but doesn't explain single-threaded Redis blocking."
        },
        {
          "score": 0,
          "description": "Approves KEYS command."
        }
      ]
    },
    {
      "id": "rb-cr-ttl",
      "category": "reliability",
      "label": "TTL & Memory Bound Enforcement",
      "description": "Requires EXPIRE / SET EX to prevent unbounded memory growth.",
      "weight": 4,
      "levels": [
        {
          "score": 3,
          "description": "Requires EX matching JWT exp claim, calculates memory savings."
        },
        {
          "score": 1,
          "description": "Mentions TTL without tying to token expiry."
        },
        {
          "score": 0,
          "description": "Misses missing TTL."
        }
      ]
    }
  ],
  "alternatives": [
    "Using a monotonic `user_token_version` column in the database/Redis: when a user logs out or resets password, increment `version = version + 1`. All tokens with older versions are immediately invalid without deleting individual keys."
  ],
  "commonMistakes": [
    "Suggesting `SCAN` without noting that `SCAN` is still a loop; Set-based indexing is O(1) and far superior for user-scoped lookup."
  ],
  "followUps": [
    {
      "id": "sec-fq-2",
      "question": "How does the \"Token Version / Epoch\" pattern invalidate all active user sessions with a single O(1) integer update?",
      "expectedConcepts": [
        "Embed token_version in JWT claims",
        "Store current user version in Redis/DB",
        "Incrementing version invalidates all older tokens instantly"
      ],
      "sampleStrongAnswer": "In the Token Version pattern, every user has an integer `token_version` (e.g. 1) stored in their database/Redis profile and embedded inside their JWT payload. When authenticating, the API checks `jwt.token_version === user.token_version`. When a user clicks \"Logout from all devices\" or changes their password, you simply increment `user.token_version = token_version + 1`. All previously issued JWTs immediately fail validation in a single O(1) write without tracking millions of individual session keys."
    }
  ]
}
```
