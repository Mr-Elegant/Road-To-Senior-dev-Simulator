function solution({ orders, events }) {
  const copy = orders.map(order => ({ ...order }));
  const outcomes = events.map(event => {
    const order = copy.find(order => order.id === event.orderId);
    if (!order) return "mismatch";
    order.status = event.type === "succeeded" ? "paid" : "failed";
    return order.status;
  });
  return { orders: copy, outcomes };
}