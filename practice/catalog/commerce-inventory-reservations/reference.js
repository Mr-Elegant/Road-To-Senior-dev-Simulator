function solution({ stock, commands }) {
  let available = stock;
  const ledger = new Map();
  const outcomes = commands.map(command => {
    const previous = ledger.get(command.id);
    if (command.type === "reserve") {
      if (!Number.isSafeInteger(command.quantity) || command.quantity <= 0) return "invalid";
      if (previous) return previous.quantity === command.quantity ? "duplicate" : "conflict";
      if (available < command.quantity) return "unavailable";
      available -= command.quantity;
      ledger.set(command.id, { id: command.id, quantity: command.quantity, status: "held" });
      return "reserved";
    }
    if (command.type !== "release") return "invalid";
    if (!previous) return "not_found";
    if (previous.status === "released") return "duplicate";
    available += previous.quantity;
    ledger.set(command.id, { ...previous, status: "released" });
    return "released";
  });
  return { available, reservations: [...ledger.values()], outcomes };
}
