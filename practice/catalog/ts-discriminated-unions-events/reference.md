# Reference: Multi-Gateway Webhook Event Normalization & Exhaustive Narrowing

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Discriminated unions require a common property (a discriminant) with literal types on each member of the union. Here, 'type' serves as the discriminant. By matching on 'event.type' in a switch statement, TypeScript automatically narrows 'event' to the exact interface corresponding to that branch.\n      \nIn the 'default' case, if all branches are handled, 'event' is narrowed to the bottom type 'never'. If a developer later introduces a new event (e.g. AdyenRefund) to WebhookEvent but forgets to add a case, 'event' in the default case will have the type 'AdyenRefund'. Passing it to 'assertNever(value: never)' will trigger a compile-time type error: \"Argument of type 'AdyenRefund' is not assignable to parameter of type 'never'.\"",
    "codeOrArtifact": "export function handleWebhookEvent(event: WebhookEvent): string {\n  switch (event.type) {\n    case 'charge.succeeded':\n      return `Processed Stripe charge: ${event.payload.chargeId} for ${event.payload.amountInCents} cents`;\n    case 'invoice.payment_failed':\n      return `Alert: Stripe invoice ${event.payload.invoiceId} failed: ${event.payload.reason}`;\n    case 'ORDER.APPROVED':\n      return `PayPal order ${event.payload.orderId} approved for ${event.payload.grossAmount}`;\n    case 'CAPTURE_SUCCESS':\n      return `Adyen capture ${event.payload.pspReference} confirmed`;\n    default:\n      return assertNever(event);\n  }\n}"
  },
  "rubric": [
    {
      "id": "rb-ts-discriminated",
      "category": "correctness",
      "label": "Discriminated Union Implementation",
      "description": "Successfully discriminates all variants and accesses nested payloads safely.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "All variants handled, payload narrowed with zero type assertions."
        },
        {
          "score": 2,
          "description": "Handles cases but uses \"as\" type casts."
        },
        {
          "score": 0,
          "description": "Fails to discriminate union."
        }
      ]
    },
    {
      "id": "rb-ts-exhaustive",
      "category": "code_quality",
      "label": "Compile-Time Exhaustiveness Guarantees",
      "description": "Uses never type check in default case to guarantee exhaustive coverage.",
      "weight": 4,
      "levels": [
        {
          "score": 3,
          "description": "Correctly applies assertNever pattern to catch unhandled future cases."
        },
        {
          "score": 1,
          "description": "Returns generic string without never assertion."
        },
        {
          "score": 0,
          "description": "No exhaustiveness enforcement."
        }
      ]
    }
  ],
  "alternatives": [
    "Using a lookup object mapping event type to handler functions with Record<WebhookEvent[\"type\"], (event: any) => string> constrained by generics.",
    "Combining with Zod / Valibot for runtime validation at the HTTP edge before passing into typed domain logic."
  ],
  "commonMistakes": [
    "Using \"as any\" inside the cases instead of letting TypeScript naturally narrow the payload.",
    "Forgetting the assertNever call, leaving unhandled cases silently ignored at compile time."
  ],
  "followUps": [
    {
      "id": "ts-fq-1",
      "question": "Why does TypeScript type-checking not protect your application from malformed JSON payloads at runtime?",
      "expectedConcepts": [
        "Type erasure at compile time",
        "Runtime validation needed (Zod, ArkType, io-ts)",
        "Untrusted boundary validation"
      ],
      "sampleStrongAnswer": "TypeScript types are completely erased during compilation and do not exist at runtime in JavaScript. External data arriving via network HTTP requests must be validated using runtime schema libraries like Zod, Valibot, or JSON Schema before being safely cast to TypeScript types."
    }
  ]
}
```
