# Reference: Automated Nightly Payment Gateway Reconciliation & Variance Ledger

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "Financial Reconciliation Principles:\n1. Never assume webhooks are 100% reliable. Network partitions or bugs in webhook receivers inevitably drop some events over a billing cycle.\n2. Three-Way Reconciliation Architecture:\n   - System A: Internal Orders / Invoices Database.\n   - System B: Payment Gateway Settlement Feed (Stripe Balance Transactions).\n   - System C: Bank Account Deposit Statement.\n3. The reconciliation worker matches System A against System B:\n   - Match: Both agree on gross amount and currency.\n   - Missing Internal: Stripe charged customer, but internal DB has no record. Trigger auto-healing or alert finance.\n   - Missing Gateway: Internal DB marked order as paid, but Stripe never received the charge. Fraud / critical bug alert!\n   - Amount / Fee Variance: Gross amount differs or dispute fees altered net settlement.",
    "codeOrArtifact": "function reconcileTransactions(internalLedger, gatewaySettlement) {\n  const gatewayMap = new Map();\n  for (const item of gatewaySettlement) {\n    gatewayMap.set(item.metadataOrderId, item);\n  }\n\n  const visitedGatewayOrders = new Set();\n  const matched = [];\n  const variances = [];\n\n  // 1. Check internal records against gateway\n  for (const internal of internalLedger) {\n    const gw = gatewayMap.get(internal.orderId);\n\n    if (!gw) {\n      variances.push({\n        type: 'MISSING_IN_GATEWAY',\n        orderId: internal.orderId,\n        internalAmountCents: internal.amountCents,\n        description: 'Order marked PAID in database, but no matching settlement charge exists at payment gateway!',\n      });\n      continue;\n    }\n\n    visitedGatewayOrders.add(internal.orderId);\n\n    if (internal.amountCents !== gw.grossCents) {\n      variances.push({\n        type: 'AMOUNT_MISMATCH',\n        orderId: internal.orderId,\n        internalAmountCents: internal.amountCents,\n        gatewayGrossCents: gw.grossCents,\n        differenceCents: gw.grossCents - internal.amountCents,\n      });\n    } else {\n      matched.push({\n        orderId: internal.orderId,\n        grossCents: gw.grossCents,\n        feeCents: gw.feeCents,\n        netCents: gw.netCents,\n      });\n    }\n  }\n\n  // 2. Identify orphaned gateway charges (dropped webhooks)\n  for (const gw of gatewaySettlement) {\n    if (!visitedGatewayOrders.has(gw.metadataOrderId)) {\n      variances.push({\n        type: 'MISSING_IN_INTERNAL_DB',\n        orderId: gw.metadataOrderId,\n        gatewayTxnId: gw.txnId,\n        gatewayGrossCents: gw.grossCents,\n        description: 'Customer was charged at gateway, but no internal order record exists (likely dropped webhook).',\n      });\n    }\n  }\n\n  return {\n    matchedCount: matched.length,\n    varianceCount: variances.length,\n    variances,\n    matched,\n  };\n}"
  },
  "rubric": [
    {
      "id": "rb-recon-logic",
      "category": "correctness",
      "label": "Three-Way Reconciliation Algorithm",
      "description": "Implements bi-directional matching, fee verification, and variance categorization.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Bi-directional O(N) matching, identifies fee discrepancies, dropped webhooks, and outputs auditable report."
        },
        {
          "score": 2,
          "description": "Matches one direction only (misses orphaned gateway charges)."
        },
        {
          "score": 0,
          "description": "Incomplete reconciliation."
        }
      ]
    }
  ],
  "alternatives": [
    "Using double-entry bookkeeping ledgers with explicit debit/credit journals (e.g. Ledger / Formance)."
  ],
  "commonMistakes": [
    "Only iterating through internal orders: you completely miss charges made in Stripe that never reached your database.",
    "Comparing floating dollar amounts instead of integer cents, resulting in false-positive penny variance warnings."
  ],
  "followUps": [
    {
      "id": "recon-fq-1",
      "question": "What is Double-Entry Bookkeeping and why is it mandatory for fintech payment platforms?",
      "expectedConcepts": [
        "Every transaction has equal and offsetting debit and credit",
        "Total debits must equal total credits",
        "Prevents money from being created or destroyed by software bugs"
      ],
      "sampleStrongAnswer": "Double-entry bookkeeping mandates that every financial event affects at least two accounts with equal and offsetting debits and credits (`Debits === Credits`). If money moves from a customer wallet to platform revenue, it is recorded in both accounts simultaneously. If a bug fails to write one side or corrupts a number, the ledger trial balance fails to balance, immediately alerting engineers before money is lost."
    }
  ]
}
```
