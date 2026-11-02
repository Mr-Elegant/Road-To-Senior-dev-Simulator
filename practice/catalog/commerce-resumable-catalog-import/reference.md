# Reference: E-commerce: Resume a Catalog Import Without Corrupting Prices

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "The starter searches SKU globally and has no durable receipt. Normalize and validate each row before claiming its identity. A receipt stores the original normalized payload so a replay is either a no-op or an explicit conflict, never a destructive reapplication. In production make receipt claim and tenant-scoped product upsert one transaction, with unique constraints on tenant/import/row and tenant/SKU. A failed upsert must roll back the receipt. This fixture assumes ordered rows; parallel workers need per-SKU ordering or source revisions to prevent an older row winning. Bind job ownership to authenticated tenant context and the original file checksum. Test restart after commit, rollback before commit, duplicate delivery, and two tenants sharing a SKU. Expose per-row errors and durable progress; pause a bad import and compensate from versioned before-images rather than replaying old rows indiscriminately.",
    "codeOrArtifact": "function solution({ tenantId, importId, products, receipts, rows }) {\n  const copy = products.map(product => ({ ...product }));\n  const journal = receipts.map(receipt => ({ ...receipt }));\n  const outcomes = rows.map(row => {\n    const sku = typeof row.sku === \"string\" ? row.sku.trim() : \"\";\n    if (!Number.isSafeInteger(row.rowNumber) || row.rowNumber <= 0 || !sku ||\n        !Number.isSafeInteger(row.priceCents) || row.priceCents < 0) return \"invalid\";\n    const prior = journal.find(r => r.tenantId === tenantId && r.importId === importId && r.rowNumber === row.rowNumber);\n    if (prior) return prior.sku === sku && prior.priceCents === row.priceCents ? \"duplicate\" : \"conflict\";\n    const product = copy.find(p => p.tenantId === tenantId && p.sku === sku);\n    if (product) product.priceCents = row.priceCents;\n    else copy.push({ tenantId, sku, priceCents: row.priceCents });\n    journal.push({ tenantId, importId, rowNumber: row.rowNumber, sku, priceCents: row.priceCents });\n    return \"applied\";\n  });\n  return { products: copy, receipts: journal, outcomes };\n}"
  },
  "rubric": [
    {
      "id": "commerce-resumable-catalog-import-correctness",
      "category": "correctness",
      "weight": 5,
      "label": "Business invariant and edge cases",
      "description": "Retries do not overwrite later rows and product identity includes the trusted tenant.",
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
      "id": "commerce-resumable-catalog-import-production",
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
    "Validate into staging tables, then publish a versioned catalog atomically when all rows satisfy the chosen import policy."
  ],
  "commonMistakes": [
    "Skipping every row before a global cursor when processing was parallel or partial.",
    "Recording a receipt before a product update without a shared transaction."
  ],
  "followUps": [
    {
      "id": "import-file",
      "question": "What if the user uploads an edited file using the same job ID?",
      "expectedConcepts": [
        "immutable source identity",
        "checksum",
        "conflict"
      ],
      "sampleStrongAnswer": "Bind the job to the original checksum and tenant. Reject a different file under that identity and create a new job; do not reinterpret existing row receipts as evidence for the edited source."
    }
  ]
}
```
