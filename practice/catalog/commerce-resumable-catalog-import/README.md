# E-commerce: Resume a Catalog Import Without Corrupting Prices

Collection: catalog · ID: `commerce-resumable-catalog-import` · Mode: **javascript**

## Business context

A supplier uploads a large catalog. After a worker restart, repeated rows overwrite newer values and SKU lookups update products belonging to another merchant.

## Task

Implement solution({ tenantId, importId, products, receipts, rows }) returning { products, receipts, outcomes }. tenantId is trusted server context. Products have tenantId, sku, priceCents and are unique per tenant/SKU. Receipts are successful rows { tenantId, importId, rowNumber, sku, priceCents }. A row has rowNumber, sku, priceCents. Process rows in order. Normalize SKU by trimming whitespace; SKU comparison is case-sensitive. Keep existing array order and append new products/receipts in processing order.

## Candidate tasks

- Implement partial success, receipt-based recovery, and tenant-scoped upserts.
- Explain transaction boundaries, parallel worker claims, and why one global last-row cursor is unsafe.

## Constraints

- Validate first: positive safe-integer rowNumber, nonempty string SKU after trim, and nonnegative safe-integer priceCents. Invalid rows return invalid and create no receipt.
- Find receipts by tenantId, importId, rowNumber. Matching normalized SKU/price returns duplicate; a changed payload returns conflict. Otherwise upsert only the current tenant/SKU, append a receipt, and return applied. Later rows may update the same SKU. Do not mutate inputs; initial receipts and products are valid.

## Follow-up questions

- What if the user uploads an edited file using the same job ID?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/commerce-resumable-catalog-import
npm run practice:watch -- catalog/commerce-resumable-catalog-import
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
