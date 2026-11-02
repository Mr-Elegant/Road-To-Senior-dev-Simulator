# Reference: Code Review PR #412: Marketplace Payout Split & Transfer Engine

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Code Review Findings Summary:\n1. [CRITICAL SECURITY] Insecure Direct Object Reference (IDOR) / Missing Authorization Check (Lines 12-14)\nThe function checks 'if (!requestedByUserId)', which only verifies that a string was passed. It never checks if 'requestedByUserId' is an authorized billing administrator or the merchant owning this order. Any authenticated user can call this endpoint with any orderId and trigger unauthorized payouts.\nFix: Query user permissions: 'if (!user.roles.includes(\"BILLING_ADMIN\") && order.merchantId !== user.id) throw new ForbiddenError()'.\n\n2. [CRITICAL CORRECTNESS] Floating Point Arithmetic in Financial Calculations (Lines 18-20)\nJavaScript numbers are 64-bit IEEE 754 floats. Multiplying floats (e.g. 19.99 * 0.15) produces rounding errors like 2.9984999999999996. Over millions of transactions, these fractional errors result in regulatory ledger mismatches.\nFix: Represent all monetary values in integer cents (e.g. 1999 cents) and use integer math or a high-precision library like 'dinero.js' or 'decimal.js'.\n\n3. [CRITICAL RELIABILITY] Stripe API Expects Integer Cents (Line 28)\nStripe's 'stripe.transfers.create({ amount })' expects an integer in the currency's smallest unit (e.g. 500 for $5.00 USD). Passing a floating dollar number like '15.5' either causes Stripe to reject the API call with 400 Invalid Integer or truncates it to 15 cents ($0.15 payout instead of $15.00).\n\n4. [HIGH RELIABILITY] Unawaited Async Function in Array.prototype.map (Lines 25-33)\n'order.vendorSplits.map(async ...)' returns an array of pending promises that are discarded. The function returns '{ success: true }' immediately before transfers even contact Stripe. If any transfer fails, it triggers an UnhandledPromiseRejection and the caller never knows.\nFix: Use 'await Promise.all(order.vendorSplits.map(...))' or a sequential 'for (const split of order.vendorSplits)' loop.",
    "codeOrArtifact": "/**\n * Corrected Production-Ready Payout Service\n */\nasync function processVendorPayoutsRemediated(orderId, requestedByUser) {\n  // 1. Authorization Guard\n  const order = await db.getOrder(orderId);\n  if (!order) throw new NotFoundError('Order not found');\n\n  const isAuthorized = requestedByUser.roles.includes('ADMIN') || order.merchantId === requestedByUser.id;\n  if (!isAuthorized) throw new ForbiddenError('Unauthorized to trigger payouts for this order');\n\n  // 2. Integer Cent Math (Amount in cents: $100.00 = 10000)\n  const orderAmountCents = order.amountInCents; \n  const platformFeeBps = 1500; // 15.00% in Basis Points (1 bps = 0.01%)\n  const platformFeeCents = Math.round((orderAmountCents * platformFeeBps) / 10000);\n  const vendorPayoutCents = orderAmountCents - platformFeeCents;\n\n  // 3. Serialized or Promise.all execution with error containment\n  const results = [];\n  for (const split of order.vendorSplits) {\n    const splitAmountCents = Math.round((vendorPayoutCents * split.bps) / 10000);\n    \n    // Idempotency key per vendor transfer\n    const transfer = await stripe.transfers.create({\n      amount: splitAmountCents,\n      currency: 'usd',\n      destination: split.vendorStripeAccountId,\n    }, {\n      idempotencyKey: `payout:${order.id}:${split.vendorId}`,\n    });\n\n    results.push(transfer);\n  }\n\n  return { success: true, orderId, transfers: results };\n}"
  },
  "rubric": [
    {
      "id": "rb-cr-security",
      "category": "security",
      "label": "IDOR & Authorization Vulnerability Detection",
      "description": "Identifies missing tenant/vendor ownership check on requestedByUserId.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Catches IDOR authorization flaw and prescribes RBAC check (isUserVendorAdmin)."
        },
        {
          "score": 1,
          "description": "Mentions authentication but not authorization."
        },
        {
          "score": 0,
          "description": "Misses security flaw."
        }
      ]
    },
    {
      "id": "rb-cr-math",
      "category": "correctness",
      "label": "Financial Accuracy & Currency Integer Representation",
      "description": "Flags IEEE 754 float precision loss and Stripe integer cents requirement.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Identifies float math error, demands integer cents / Decimal.js, notes Stripe expects integer cents."
        },
        {
          "score": 2,
          "description": "Flags rounding but unaware of Stripe integer cent API contract."
        },
        {
          "score": 0,
          "description": "Misses financial calculation error."
        }
      ]
    },
    {
      "id": "rb-cr-async",
      "category": "reliability",
      "label": "Async Promise Array Execution Flaw",
      "description": "Catches unawaited async map and recommends Promise.all / for-of.",
      "weight": 4,
      "levels": [
        {
          "score": 3,
          "description": "Highlights unawaited promises in map, mandates Promise.all or serial for-of with error containment."
        },
        {
          "score": 0,
          "description": "Misses async map bug."
        }
      ]
    }
  ],
  "alternatives": [
    "Using Stripe Split Charges / Destination Charges natively on checkout creation to avoid custom payout logic entirely."
  ],
  "commonMistakes": [
    "Only focusing on formatting or variable naming while missing the severe financial math and security flaws.",
    "Suggesting Math.floor or Math.round without converting dollars to cents first."
  ],
  "followUps": [
    {
      "id": "sec-fq-1",
      "question": "What are Basis Points (bps) and why are they standard for financial commission calculations?",
      "expectedConcepts": [
        "1 basis point = 0.01% = 0.0001",
        "Avoids floating point percentages",
        "Standard in financial trading and banking systems"
      ],
      "sampleStrongAnswer": "A basis point (bps) is one hundredth of one percent (0.01% or 0.0001). Using integer basis points (e.g. 1500 bps for 15%) allows financial calculations to remain purely in integer math (`(amountInCents * bps) / 10000`), completely avoiding floating-point percentage math like `0.15` and eliminating rounding ambiguities across accounting systems."
    }
  ]
}
```
