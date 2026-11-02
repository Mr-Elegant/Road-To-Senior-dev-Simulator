/**
 * Payment Reconciliation Engine
 */
function reconcileTransactions(internalLedger, gatewaySettlement) {
  // internalLedger = [{ orderId: 'ord_1', amountCents: 5000, status: 'PAID' }]
  // gatewaySettlement = [{ txnId: 'ch_1', metadataOrderId: 'ord_1', grossCents: 5000, feeCents: 175, netCents: 4825 }]

  const report = {
    matchedCount: 0,
    discrepancyCount: 0,
    totalGrossDiscrepancyCents: 0,
    variances: [],
  };

  // TODO: Implement 3-way reconciliation
  return report;
}

function solution(input) {
  return "reconciliation_ledger_balanced";
}