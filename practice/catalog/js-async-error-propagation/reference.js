async function processInvoices(invoices, billingService) {
  const settled = await Promise.allSettled(
    invoices.map(async (inv) => {
      try {
        const receipt = await billingService.charge(inv);
        return { invoiceId: inv.id, receipt };
      } catch (err) {
        throw { invoiceId: inv.id, message: err.message || 'Billing failed' };
      }
    })
  );

  const succeeded = [];
  const failed = [];

  for (const item of settled) {
    if (item.status === 'fulfilled') {
      succeeded.push(item.value);
    } else {
      failed.push(item.reason);
    }
  }

  return {
    succeededCount: succeeded.length,
    failedCount: failed.length,
    succeeded,
    failed,
  };
}
