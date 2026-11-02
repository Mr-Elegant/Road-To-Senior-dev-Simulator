function solution({ tenantId, importId, products, receipts, rows }) {
  const copy = products.map(product => ({ ...product }));
  const journal = receipts.map(receipt => ({ ...receipt }));
  const outcomes = rows.map(row => {
    const sku = typeof row.sku === "string" ? row.sku.trim() : "";
    if (!Number.isSafeInteger(row.rowNumber) || row.rowNumber <= 0 || !sku ||
        !Number.isSafeInteger(row.priceCents) || row.priceCents < 0) return "invalid";
    const prior = journal.find(r => r.tenantId === tenantId && r.importId === importId && r.rowNumber === row.rowNumber);
    if (prior) return prior.sku === sku && prior.priceCents === row.priceCents ? "duplicate" : "conflict";
    const product = copy.find(p => p.tenantId === tenantId && p.sku === sku);
    if (product) product.priceCents = row.priceCents;
    else copy.push({ tenantId, sku, priceCents: row.priceCents });
    journal.push({ tenantId, importId, rowNumber: row.rowNumber, sku, priceCents: row.priceCents });
    return "applied";
  });
  return { products: copy, receipts: journal, outcomes };
}
