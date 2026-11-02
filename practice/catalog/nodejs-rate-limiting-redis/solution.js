/**
 * Non-Atomic Distributed Rate Limiter
 */
class RedisRateLimiter {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  async checkLimit(apiKey) {
    const key = `rate:${apiKey}`;
    
    // BUG: Read-Modify-Write race condition!
    // Multiple concurrent requests read the same count simultaneously.
    const current = await this.redis.get(key);
    const count = current ? parseInt(current, 10) : 0;

    if (count >= 100) {
      return { allowed: false, remaining: 0 };
    }

    await this.redis.incr(key);
    if (count === 0) {
      await this.redis.expire(key, 60);
    }

    return { allowed: true, remaining: 100 - (count + 1) };
  }
}

function solution(input) {
  return "atomic_lua_sliding_window";
}