# Reference: Resilient Multi-Provider WhatsApp & SMS Fallback Orchestrator

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "In critical delivery systems like 2FA OTP, relying on a single third-party vendor creates a single point of failure (SPOF).\nTo achieve five-nines (99.999%) delivery reliability:\n1. Multi-Provider Cascade: Try preferred provider (WhatsApp Meta API). If it fails, cascade to Secondary (Twilio SMS), then Tertiary (AWS SNS).\n2. Per-Call Timeout: Wrap every external HTTP request in a strict 2-3 second timeout. Without this, a degraded provider that hangs for 30 seconds will cause the user's login session to time out.\n3. Circuit Breaker: If a provider fails 5 times consecutively, trip the circuit to OPEN for 60 seconds. During this window, all requests skip the broken provider immediately without attempting network I/O.",
    "codeOrArtifact": "class ProviderCircuitBreaker {\n  constructor(name, providerFn, failureThreshold = 5, resetTimeoutMs = 60000) {\n    this.name = name;\n    this.providerFn = providerFn;\n    this.failureThreshold = failureThreshold;\n    this.resetTimeoutMs = resetTimeoutMs;\n    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN\n    this.failureCount = 0;\n    this.nextAttempt = Date.now();\n  }\n\n  async execute(...args) {\n    if (this.state === 'OPEN') {\n      if (Date.now() > this.nextAttempt) {\n        this.state = 'HALF_OPEN';\n      } else {\n        throw new Error(`Circuit breaker for ${this.name} is OPEN`);\n      }\n    }\n\n    try {\n      const result = await Promise.race([\n        this.providerFn(...args),\n        new Promise((_, reject) =>\n          setTimeout(() => reject(new Error(`Timeout contacting ${this.name}`)), 2500)\n        ),\n      ]);\n\n      this.failureCount = 0;\n      this.state = 'CLOSED';\n      return result;\n    } catch (err) {\n      this.failureCount++;\n      if (this.failureCount >= this.failureThreshold) {\n        this.state = 'OPEN';\n        this.nextAttempt = Date.now() + this.resetTimeoutMs;\n      }\n      throw err;\n    }\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-circuit-breaker",
      "category": "reliability",
      "label": "Circuit Breaker & Fallback Architecture",
      "description": "Implements circuit breaker states and per-attempt timeouts.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Circuit breaker state machine, cascading fallback, timeout protection, telemetry logging."
        },
        {
          "score": 2,
          "description": "Implements try/catch fallback but missing circuit breaker or timeout."
        },
        {
          "score": 0,
          "description": "Single provider only."
        }
      ]
    }
  ],
  "alternatives": [
    "Sending via message broker (RabbitMQ / SQS) with dead-letter exchange retry policies."
  ],
  "commonMistakes": [
    "Not putting a timeout on external provider calls: if Twilio takes 25 seconds to fail, user gives up and closes app.",
    "Tripping the circuit breaker on invalid phone numbers (400 Client Error) instead of 5xx Server Errors / Network Timeouts."
  ],
  "followUps": [
    {
      "id": "integ-fq-2",
      "question": "Why should 4xx HTTP responses NOT trip a provider circuit breaker?",
      "expectedConcepts": [
        "4xx indicates client error (e.g. invalid phone number format)",
        "5xx/timeouts indicate provider infrastructure failure"
      ],
      "sampleStrongAnswer": "A circuit breaker protects against provider infrastructure degradation (5xx errors, socket timeouts, TCP connection drops). A 4xx error (like 400 Bad Request or 422 Invalid Phone Number) is a client-side validation mistake. Tripping the circuit breaker on 4xx errors would cause a single user with an invalid phone number to shut down the provider for all other valid users."
    }
  ]
}
```
