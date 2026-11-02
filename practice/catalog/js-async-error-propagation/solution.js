/**
 * Fragile Invoice Batch Processing
 */
async function processInvoices(invoices, billingService) {
  const results = [];

  // BUG 1: forEach does not await async callbacks!
  // BUG 2: Unhandled exceptions inside async callbacks trigger process unhandledRejection
  invoices.forEach(async (inv) => {
    const receipt = await billingService.charge(inv);
    results.push(receipt);
  });

  return results;
}

// Verification runner
async function solution(scenario) {
  const mockService = {
    charge: async (inv) => {
      if (inv.id === 2) throw new Error("Card expired");
      return { id: inv.id, status: "PAID" };
    }
  };

  const invoices = [{ id: 1 }, { id: 2 }, { id: 3 }];
  
  // Refactor to use safe batch execution
  // Return summary object { succeeded: count, failedCount: count }
  return "repaired";
}