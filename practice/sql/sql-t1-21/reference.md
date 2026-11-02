# Reference: Date and Time Types: TIMESTAMP vs. TIMESTAMPTZ

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "In PostgreSQL, TIMESTAMPTZ is the gold standard for transaction records. TIMESTAMPTZ does NOT store a time zone string; rather, it converts any input time to UTC and stores it as an 8-byte UTC integer. When queried, it automatically converts UTC to the client session's configured time zone. In contrast, TIMESTAMP (without time zone) blindly stores the literal digits provided without context, leading to catastrophic timezone offsets and DST errors in distributed systems.",
    "followUp": {
      "question": "How do you set the session time zone in PostgreSQL for testing?",
      "expectedAnswer": "Execute SET TIME ZONE 'UTC'; or SET TIME ZONE 'America/New_York'; which alters display formatting for TIMESTAMPTZ columns in the current session."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Accurately explains UTC storage in TIMESTAMPTZ",
      "Explains pitfalls of TIMESTAMP without time zone",
      "Recommends TIMESTAMPTZ for production"
    ]
  },
  "expectedConcepts": [
    "TIMESTAMPTZ converts to and stores UTC internally",
    "Client session timezone conversion",
    "TIMESTAMP without time zone lacks timezone awareness",
    "Production best practice for audit logs"
  ]
}
```
