class ProviderCircuitBreaker {
  constructor(name, providerFn, failureThreshold = 5, resetTimeoutMs = 60000) {
    this.name = name;
    this.providerFn = providerFn;
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }

  async execute(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error(`Circuit breaker for ${this.name} is OPEN`);
      }
    }

    try {
      const result = await Promise.race([
        this.providerFn(...args),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout contacting ${this.name}`)), 2500)
        ),
      ]);

      this.failureCount = 0;
      this.state = 'CLOSED';
      return result;
    } catch (err) {
      this.failureCount++;
      if (this.failureCount >= this.failureThreshold) {
        this.state = 'OPEN';
        this.nextAttempt = Date.now() + this.resetTimeoutMs;
      }
      throw err;
    }
  }
}
