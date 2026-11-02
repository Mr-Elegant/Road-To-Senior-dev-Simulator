function solution({ stock, commands }) {
  const reservations = [];
  const outcomes = [];
  for (const command of commands) {
    if (command.type === "reserve") {
      stock -= command.quantity;
      reservations.push({ id: command.id, quantity: command.quantity, status: "held" });
      outcomes.push("reserved");
    } else {
      const reservation = reservations.find(r => r.id === command.id);
      if (reservation) stock += reservation.quantity;
      outcomes.push("released");
    }
  }
  return { available: stock, reservations, outcomes };
}