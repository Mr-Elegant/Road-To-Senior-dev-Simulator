function reconcileTransactions(internalLedger, gatewaySettlement) {
  const gatewayMap = new Map();
  for (const item of gatewaySettlement) {
    gatewayMap.set(item.metadataOrderId, item);
  }

  const visitedGatewayOrders = new Set();
  const matched = [];
  const variances = [];

  // 1. Check internal records against gateway
  for (const internal of internalLedger) {
    const gw = gatewayMap.get(internal.orderId);

    if (!gw) {
      variances.push({
        type: 'MISSING_IN_GATEWAY',
        orderId: internal.orderId,
        internalAmountCents: internal.amountCents,
        description: 'Order marked PAID in database, but no matching settlement charge exists at payment gateway!',
      });
      continue;
    }

    visitedGatewayOrders.add(internal.orderId);

    if (internal.amountCents !== gw.grossCents) {
      variances.push({
        type: 'AMOUNT_MISMATCH',
        orderId: internal.orderId,
        internalAmountCents: internal.amountCents,
        gatewayGrossCents: gw.grossCents,
        differenceCents: gw.grossCents - internal.amountCents,
      });
    } else {
      matched.push({
        orderId: internal.orderId,
        grossCents: gw.grossCents,
        feeCents: gw.feeCents,
        netCents: gw.netCents,
      });
    }
  }

  // 2. Identify orphaned gateway charges (dropped webhooks)
  for (const gw of gatewaySettlement) {
    if (!visitedGatewayOrders.has(gw.metadataOrderId)) {
      variances.push({
        type: 'MISSING_IN_INTERNAL_DB',
        orderId: gw.metadataOrderId,
        gatewayTxnId: gw.txnId,
        gatewayGrossCents: gw.grossCents,
        description: 'Customer was charged at gateway, but no internal order record exists (likely dropped webhook).',
      });
    }
  }

  return {
    matchedCount: matched.length,
    varianceCount: variances.length,
    variances,
    matched,
  };
}
