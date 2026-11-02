function solution({ orders, events }) {
  const copy = orders.map(order => ({ ...order }));
  const seen = new Set();
  const payments = new Map();
  const outcomes = events.map(event => {
    if (event.verified !== true) return "unverified";
    if (!["succeeded", "failed"].includes(event.type)) return "ignored";
    const order = copy.find(order => order.id === event.orderId);
    if (!order || !Number.isSafeInteger(event.amount) || event.amount <= 0 ||
        order.total !== event.amount || order.currency !== event.currency) return "mismatch";
    if (seen.has(event.id)) return "duplicate";
    if (event.type === "succeeded") {
      if (payments.has(event.paymentId)) {
        if (payments.get(event.paymentId) !== order.id) return "conflict";
        seen.add(event.id);
        return "duplicate";
      }
      if (order.status === "paid") return "review";
      payments.set(event.paymentId, order.id);
      order.status = "paid";
      seen.add(event.id);
      return "paid";
    }
    seen.add(event.id);
    if (order.status === "paid") return "ignored";
    order.status = "failed";
    return "failed";
  });
  return { orders: copy, outcomes };
}
