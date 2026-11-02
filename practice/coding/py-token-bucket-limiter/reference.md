# Reference: Python Token Bucket Distributed Rate Limiter

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "code": "import time\n\nclass TokenBucket:\n    def __init__(self, capacity: int, refill_rate: float):\n        self.capacity = capacity\n        self.refill_rate = refill_rate\n        self.tokens = capacity\n        self.last_refill = time.time()\n\n    def consume(self, amount: int = 1) -> bool:\n        now = time.time()\n        elapsed = now - self.last_refill\n        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)\n        self.last_refill = now\n\n        if self.tokens >= amount:\n            self.tokens -= amount\n            return True\n        return False",
    "explanation": "Calculates fractional tokens generated based on elapsed time delta, bounds tokens at maximum bucket capacity, and debits requested tokens.",
    "timeComplexity": "O(1)"
  }
}
```
