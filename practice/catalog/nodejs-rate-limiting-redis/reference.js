const SLIDING_WINDOW_LUA = `
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])
  local clearBefore = now - window

  redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
  local currentRequests = redis.call('ZCARD', key)

  if currentRequests < limit then
    redis.call('ZADD', key, now, now)
    redis.call('EXPIRE', key, math.ceil(window / 1000))
    return {1, limit - currentRequests - 1}
  else
    return {0, 0}
  end
`;

class AtomicSlidingWindowLimiter {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  async checkLimit(apiKey, limit = 100, windowMs = 60000) {
    const key = `rate:${apiKey}`;
    const now = Date.now();
    const [allowed, remaining] = await this.redis.eval(
      SLIDING_WINDOW_LUA,
      1,
      key,
      now,
      windowMs,
      limit
    );

    return {
      allowed: Boolean(allowed),
      remaining,
    };
  }
}
