function solution({ tenantId, products, receipts, rows }) {
  const copy = products.map(product => ({ ...product }));
  const outcomes = rows.map(row => {
    const product = copy.find(product => product.sku === row.sku);
    if (product) product.priceCents = row.priceCents;
    else copy.push({ tenantId, sku: row.sku, priceCents: row.priceCents });
    return "applied";
  });
  return { products: copy, receipts: receipts.slice(), outcomes };
}