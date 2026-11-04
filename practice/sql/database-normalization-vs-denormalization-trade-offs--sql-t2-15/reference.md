# Reference: Database Normalization vs. Denormalization Trade-offs

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "Denormalization intentionally adds redundant data to eliminate expensive joins and aggregations on hot read paths. Storing `total_amount` on `orders` is justified because historical invoice totals are immutable (they must capture price at the exact moment of purchase, even if product prices change later). Risks: Update anomalies and data divergence if redundant values fall out of sync. Mitigations: 1. Use database triggers or strict application service layers to synchronize redundant fields. 2. Treat denormalized historical financial fields as append-only snapshots.",
    "followUp": {
      "question": "What is a Generated Column in PostgreSQL and how does it support safe denormalization?",
      "expectedAnswer": "PostgreSQL supports GENERATED ALWAYS AS (expression) STORED. The database engine automatically computes and stores the derived column on insert/update, guaranteeing that the denormalized value is mathematically impossible to fall out of sync."
    }
  },
  "rubric": {
    "correctnessWeight": 40,
    "semanticRelationalWeight": 30,
    "performanceWeight": 15,
    "edgeCaseWeight": 15,
    "criteria": [
      "Identifies read vs write trade-off",
      "Explains historical point-in-time snapshot necessity",
      "Identifies divergence risks"
    ]
  },
  "expectedConcepts": [
    "Read performance vs write complexity trade-off",
    "Historical price immutability argument",
    "Risk of data divergence / update anomaly",
    "Trigger-based or service-layer synchronization"
  ]
}
```
