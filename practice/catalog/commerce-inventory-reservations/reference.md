# Reference: E-commerce: Stop Overselling the Last Item

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The failure combines unchecked subtraction, missing retry identity, and a release without a terminal state. Validate the requested quantity, keep reservation identity after release, and update inventory and reservation status together. In production, one transaction must atomically claim a tenant-scoped reservation key, conditionally decrement stock with available >= quantity, and insert the reservation; roll back the claim when stock is insufficient. A unique constraint resolves concurrent retries. Release should conditionally transition held to released and restore units in the same transaction. Expiry workers use the same transition. Verify with two database connections racing for one unit, duplicate checkout delivery, worker crashes, and repeated expiry. Track rejected reservations and reconciliation mismatches; stop new reservations during repair rather than resetting the ledger. [PostgreSQL locking](https://www.postgresql.org/docs/current/explicit-locking.html).",
    "codeOrArtifact": "function solution({ stock, commands }) {\n  let available = stock;\n  const ledger = new Map();\n  const outcomes = commands.map(command => {\n    const previous = ledger.get(command.id);\n    if (command.type === \"reserve\") {\n      if (!Number.isSafeInteger(command.quantity) || command.quantity <= 0) return \"invalid\";\n      if (previous) return previous.quantity === command.quantity ? \"duplicate\" : \"conflict\";\n      if (available < command.quantity) return \"unavailable\";\n      available -= command.quantity;\n      ledger.set(command.id, { id: command.id, quantity: command.quantity, status: \"held\" });\n      return \"reserved\";\n    }\n    if (command.type !== \"release\") return \"invalid\";\n    if (!previous) return \"not_found\";\n    if (previous.status === \"released\") return \"duplicate\";\n    available += previous.quantity;\n    ledger.set(command.id, { ...previous, status: \"released\" });\n    return \"released\";\n  });\n  return { available, reservations: [...ledger.values()], outcomes };\n}"
  },
  "rubric": [
    {
      "id": "commerce-inventory-reservations-correctness",
      "category": "correctness",
      "weight": 5,
      "label": "Business invariant and edge cases",
      "description": "Stock never becomes negative; retries and releases do not create or consume additional units.",
      "levels": [
        {
          "score": 0,
          "description": "The original failure remains or the response is hard-coded."
        },
        {
          "score": 1,
          "description": "Happy path works; negative or replay cases fail."
        },
        {
          "score": 2,
          "description": "All fixture behaviors work, but production boundaries are unexplained."
        },
        {
          "score": 3,
          "description": "All fixture behaviors work and the business invariant is explained."
        }
      ]
    },
    {
      "id": "commerce-inventory-reservations-production",
      "category": "reliability",
      "weight": 4,
      "label": "Production design and verification",
      "description": "Separate this deterministic model from durable storage, concurrency, authorization, and recovery requirements.",
      "levels": [
        {
          "score": 0,
          "description": "Treats an in-memory model as a production guarantee."
        },
        {
          "score": 1,
          "description": "Names a production risk without a concrete mitigation."
        },
        {
          "score": 2,
          "description": "Defines persistence and failure handling, but omits a verification or rollback plan."
        },
        {
          "score": 3,
          "description": "Defines durable invariants, failure recovery, observable verification, and safe rollout."
        }
      ]
    }
  ],
  "alternatives": [
    "Serialize commands per SKU through a durable queue; retain durable reservation uniqueness and reconciliation because delivery can repeat."
  ],
  "commonMistakes": [
    "Checking available stock in one query and decrementing it in another.",
    "Deleting released keys, allowing a delayed retry to reserve again."
  ],
  "followUps": [
    {
      "id": "stock-expiry",
      "question": "What if payment succeeds while a reservation expires?",
      "expectedConcepts": [
        "conditional state transition",
        "transaction",
        "compensation"
      ],
      "sampleStrongAnswer": "Payment confirmation and expiry compete on the held state. Exactly one transition wins in a transaction. A payment after release needs a new reservation or a refund workflow; it must not silently ship unreserved inventory."
    }
  ]
}
```
