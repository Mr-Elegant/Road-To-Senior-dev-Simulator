import type { Scenario } from '@/types/scenario';
import { businessCase as tc, businessScenario } from './businessScenario';

export const commerceScenarios: Scenario[] = [
  businessScenario({
    id: 'commerce-inventory-reservations',
    title: 'E-commerce: Stop Overselling the Last Item',
    type: 'debugging', topic: 'Databases', subtopic: 'E-commerce / Inventory reservations',
    difficulty: 'Senior', estimatedMinutes: 35,
    businessContext: 'A wholesale checkout sells the last units twice during a promotion. A mobile retry reserves stock again, and a delayed cancellation returns the same units twice.',
    problemStatement: 'Implement solution({ stock, commands }) as a deterministic reservation model. stock is a nonnegative safe integer. Commands have type reserve or release and a nonempty string id. A reserve also has quantity. Process commands in order, returning { available, reservations, outcomes }. Reservations remain in first-successful-reserve order as { id, quantity, status: "held" | "released" }. Each command produces one outcome. This models serialized decisions; it does not simulate concurrent database transactions.',
    constraints: [
      'For reserve, invalid nonpositive/non-safe-integer quantity returns invalid before any other check. Existing ID with equal quantity returns duplicate, even after release; a changed quantity returns conflict. Then insufficient stock returns unavailable; otherwise return reserved.',
      'Release returns not_found for an unknown ID, duplicate for an already released ID, otherwise released and restores stock exactly once. Unknown command types return invalid. Do not mutate the input.',
    ],
    candidateTasks: ['Fix retry, quantity validation, and release behavior in the function.', 'Explain how to enforce the same invariant across multiple checkout workers and reservation expiry.'],
    starterCode: `function solution({ stock, commands }) {
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
}`,
    testCases: [
      tc('stock-1', 'Reserve available stock', { stock: 3, commands: [{ type: 'reserve', id: 'a', quantity: 2 }] }, { available: 1, reservations: [{ id: 'a', quantity: 2, status: 'held' }], outcomes: ['reserved'] }),
      tc('stock-2', 'Two checkouts compete for the final unit', { stock: 1, commands: [{ type: 'reserve', id: 'a', quantity: 1 }, { type: 'reserve', id: 'b', quantity: 1 }] }, { available: 0, reservations: [{ id: 'a', quantity: 1, status: 'held' }], outcomes: ['reserved', 'unavailable'] }),
      tc('stock-3', 'Retry does not reserve twice', { stock: 2, commands: [{ type: 'reserve', id: 'a', quantity: 2 }, { type: 'reserve', id: 'a', quantity: 2 }] }, { available: 0, reservations: [{ id: 'a', quantity: 2, status: 'held' }], outcomes: ['reserved', 'duplicate'] }, true),
      tc('stock-4', 'An idempotency key cannot change quantity', { stock: 4, commands: [{ type: 'reserve', id: 'a', quantity: 1 }, { type: 'reserve', id: 'a', quantity: 2 }] }, { available: 3, reservations: [{ id: 'a', quantity: 1, status: 'held' }], outcomes: ['reserved', 'conflict'] }, true),
      tc('stock-5', 'Release and late retry restore stock only once', { stock: 1, commands: [{ type: 'reserve', id: 'a', quantity: 1 }, { type: 'release', id: 'a' }, { type: 'release', id: 'a' }, { type: 'reserve', id: 'a', quantity: 1 }] }, { available: 1, reservations: [{ id: 'a', quantity: 1, status: 'released' }], outcomes: ['reserved', 'released', 'duplicate', 'duplicate'] }, true),
      tc('stock-6', 'Reject invalid quantities without changing stock', { stock: 2, commands: [{ type: 'reserve', id: 'a', quantity: -1 }, { type: 'reserve', id: 'b', quantity: 0 }, { type: 'reserve', id: 'c', quantity: 1.5 }, { type: 'reserve', id: 'd', quantity: '1' }, { type: 'reserve', id: 'e', quantity: 9007199254740992 }] }, { available: 2, reservations: [], outcomes: ['invalid', 'invalid', 'invalid', 'invalid', 'invalid'] }, true),
      tc('stock-7', 'Unknown commands and missing releases are harmless', { stock: 0, commands: [{ type: 'release', id: 'missing' }, { type: 'expire', id: 'missing' }] }, { available: 0, reservations: [], outcomes: ['not_found', 'invalid'] }, true),
    ],
    hints: ['Keep a reservation ledger keyed by ID, including released entries.', 'Validate quantity, check the key and its payload, then check available stock.'],
    assessment: 'Stock never becomes negative; retries and releases do not create or consume additional units.',
    referenceSolution: {
      explanation: 'The failure combines unchecked subtraction, missing retry identity, and a release without a terminal state. Validate the requested quantity, keep reservation identity after release, and update inventory and reservation status together. In production, one transaction must atomically claim a tenant-scoped reservation key, conditionally decrement stock with available >= quantity, and insert the reservation; roll back the claim when stock is insufficient. A unique constraint resolves concurrent retries. Release should conditionally transition held to released and restore units in the same transaction. Expiry workers use the same transition. Verify with two database connections racing for one unit, duplicate checkout delivery, worker crashes, and repeated expiry. Track rejected reservations and reconciliation mismatches; stop new reservations during repair rather than resetting the ledger. [PostgreSQL locking](https://www.postgresql.org/docs/current/explicit-locking.html).',
      codeOrArtifact: `function solution({ stock, commands }) {
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
}`,
    },
    alternativeApproaches: ['Serialize commands per SKU through a durable queue; retain durable reservation uniqueness and reconciliation because delivery can repeat.'],
    commonMistakes: ['Checking available stock in one query and decrementing it in another.', 'Deleting released keys, allowing a delayed retry to reserve again.'],
    followUpQuestions: [{ id: 'stock-expiry', question: 'What if payment succeeds while a reservation expires?', expectedConcepts: ['conditional state transition', 'transaction', 'compensation'], sampleStrongAnswer: 'Payment confirmation and expiry compete on the held state. Exactly one transition wins in a transaction. A payment after release needs a new reservation or a refund workflow; it must not silently ship unreserved inventory.' }],
  }),
  businessScenario({
    id: 'commerce-payment-reconciliation',
    title: 'E-commerce: Reconcile Duplicate Payment Notifications',
    type: 'debugging', topic: 'Integrations', subtopic: 'E-commerce / Payment reconciliation',
    difficulty: 'Senior', estimatedMinutes: 40,
    businessContext: 'A retailer dispatches an order twice after two different notification IDs describe the same successful payment. A delayed failure then changes a paid order back to failed.',
    problemStatement: 'Implement solution({ orders, events }) returning { orders, outcomes }. Orders have unique id, total in integer minor units, currency, and status pending/failed/paid. Each normalized event has id, paymentId, orderId, amount, currency, type succeeded/failed, and verified. The fixture starts with no processed notifications or payment ledger. Process events in order. verified represents a trusted adapter decision, not a cryptographic check performed by this function. Do not mutate input orders.',
    constraints: [
      'In order: reject verified !== true as unverified; unknown types as ignored; missing orders, mismatched amount/currency, or a nonpositive/non-safe-integer amount as mismatch. Rejected events are not recorded.',
      'For valid events, previously seen event IDs return duplicate. For a succeeded event: a paymentId already applied to the same order returns duplicate, one applied to a different order returns conflict, and a new payment for an already paid order returns review without recording it. Otherwise mark paid, record payment identity, and return paid.',
      'A failed event returns ignored if the order is already paid; otherwise mark failed and return failed. Remember valid event IDs except review/conflict. IDs are nonempty strings; event ID payloads are immutable in this normalized fixture.',
    ],
    candidateTasks: ['Fix event deduplication, payment identity, order validation, and paid-state monotonicity.', 'Describe durable atomic processing, signature verification, and handling a real second payment.'],
    starterCode: `function solution({ orders, events }) {
  const copy = orders.map(order => ({ ...order }));
  const outcomes = events.map(event => {
    const order = copy.find(order => order.id === event.orderId);
    if (!order) return "mismatch";
    order.status = event.type === "succeeded" ? "paid" : "failed";
    return order.status;
  });
  return { orders: copy, outcomes };
}`,
    testCases: [
      tc('payment-1', 'Confirmed payment marks matching order paid', { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'pending' }], events: [{ id: 'e1', paymentId: 'p1', orderId: 'o', amount: 100, currency: 'USD', type: 'succeeded', verified: true }] }, { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'paid' }], outcomes: ['paid'] }),
      tc('payment-2', 'Unverified notification cannot change an order', { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'pending' }], events: [{ id: 'e1', paymentId: 'p1', orderId: 'o', amount: 100, currency: 'USD', type: 'succeeded', verified: false }] }, { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'pending' }], outcomes: ['unverified'] }),
      tc('payment-3', 'Repeated event and distinct event for same payment apply once', { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'pending' }], events: ['e1', 'e1', 'e2'].map(id => ({ id, paymentId: 'p1', orderId: 'o', amount: 100, currency: 'USD', type: 'succeeded', verified: true })) }, { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'paid' }], outcomes: ['paid', 'duplicate', 'duplicate'] }, true),
      tc('payment-4', 'Delayed failure cannot revoke paid state', { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'paid' }], events: [{ id: 'e1', paymentId: 'p1', orderId: 'o', amount: 100, currency: 'USD', type: 'failed', verified: true }] }, { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'paid' }], outcomes: ['ignored'] }, true),
      tc('payment-5', 'Mismatch does not consume the event ID', { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'pending' }], events: [99, 100].map(amount => ({ id: 'e1', paymentId: 'p1', orderId: 'o', amount, currency: 'USD', type: 'succeeded', verified: true })) }, { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'paid' }], outcomes: ['mismatch', 'paid'] }, true),
      tc('payment-6', 'Same payment cannot pay two orders', { orders: ['a', 'b'].map(id => ({ id, total: 100, currency: 'USD', status: 'pending' })), events: ['a', 'b'].map((orderId, i) => ({ id: 'e' + i, paymentId: 'p1', orderId, amount: 100, currency: 'USD', type: 'succeeded', verified: true })) }, { orders: [{ id: 'a', total: 100, currency: 'USD', status: 'paid' }, { id: 'b', total: 100, currency: 'USD', status: 'pending' }], outcomes: ['paid', 'conflict'] }, true),
      tc('payment-7', 'Second distinct payment needs review', { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'paid' }], events: [{ id: 'e1', paymentId: 'new-payment', orderId: 'o', amount: 100, currency: 'USD', type: 'succeeded', verified: true }] }, { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'paid' }], outcomes: ['review'] }, true),
      tc('payment-8', 'Currency and missing-order mismatches are rejected', { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'pending' }], events: [{ id: 'e1', paymentId: 'p1', orderId: 'o', amount: 100, currency: 'EUR', type: 'succeeded', verified: true }, { id: 'e2', paymentId: 'p2', orderId: 'missing', amount: 100, currency: 'USD', type: 'succeeded', verified: true }] }, { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'pending' }], outcomes: ['mismatch', 'mismatch'] }, true),
      tc('payment-9', 'Failed payment can recover; unsupported notification is ignored', { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'pending' }], events: ['unknown', 'failed', 'succeeded'].map((type, i) => ({ id: 'e' + i, paymentId: 'p1', orderId: 'o', amount: 100, currency: 'USD', type, verified: true })) }, { orders: [{ id: 'o', total: 100, currency: 'USD', status: 'paid' }], outcomes: ['ignored', 'failed', 'paid'] }, true),
    ],
    hints: ['Delivery identity and business payment identity solve different duplication problems.', 'Paid state must survive older failures; a second genuine payment requires reconciliation rather than another dispatch.'],
    assessment: 'Only matching trusted events change orders, one payment cannot pay two orders, and paid state cannot regress on failure.',
    referenceSolution: {
      explanation: 'The starter trusts every notification and overwrites status on arrival. Validate the trusted adapter result and order facts first, then deduplicate event delivery and payment identity separately. An already-paid order receiving a new payment needs review, not another shipment. In a real receiver verify the signature on raw bytes, map the provider account and customer to the tenant, and commit the inbox record, payment ledger, order transition, and dispatch outbox atomically. Uniqueness must include provider account and payment identity. Do not acknowledge success until durable receipt; outbox consumers must also tolerate retries. Recover uncertain outcomes through provider reconciliation. Test simultaneous duplicates, a crash before commit, and a second genuine payment; monitor unmatched payments and dispatch counts. Roll out with shadow reconciliation and pause dispatch on invariant violations. [Stripe webhook guidance](https://docs.stripe.com/webhooks).',
      codeOrArtifact: `function solution({ orders, events }) {
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
}`,
    },
    alternativeApproaches: ['Persist verified deliveries to a durable inbox and reconcile payments in a worker; acknowledge only after the inbox commit.'],
    commonMistakes: ['Deduplicating notification IDs while allowing two events for the same payment to dispatch twice.', 'Assuming delivery order equals payment state order.'],
    followUpQuestions: [{ id: 'payment-crash', question: 'What if the worker crashes after requesting shipment but before recording success?', expectedConcepts: ['outbox', 'downstream idempotency', 'reconciliation'], sampleStrongAnswer: 'Commit a dispatch outbox entry with the order transition. Retry it using a stable fulfillment idempotency key. If the fulfillment result is uncertain, reconcile the downstream operation before creating another shipment.' }],
  }),
  businessScenario({
    id: 'commerce-resumable-catalog-import',
    title: 'E-commerce: Resume a Catalog Import Without Corrupting Prices',
    type: 'coding', topic: 'Node.js', subtopic: 'E-commerce / SaaS catalog import recovery',
    difficulty: 'Senior', estimatedMinutes: 40,
    businessContext: 'A supplier uploads a large catalog. After a worker restart, repeated rows overwrite newer values and SKU lookups update products belonging to another merchant.',
    problemStatement: 'Implement solution({ tenantId, importId, products, receipts, rows }) returning { products, receipts, outcomes }. tenantId is trusted server context. Products have tenantId, sku, priceCents and are unique per tenant/SKU. Receipts are successful rows { tenantId, importId, rowNumber, sku, priceCents }. A row has rowNumber, sku, priceCents. Process rows in order. Normalize SKU by trimming whitespace; SKU comparison is case-sensitive. Keep existing array order and append new products/receipts in processing order.',
    constraints: [
      'Validate first: positive safe-integer rowNumber, nonempty string SKU after trim, and nonnegative safe-integer priceCents. Invalid rows return invalid and create no receipt.',
      'Find receipts by tenantId, importId, rowNumber. Matching normalized SKU/price returns duplicate; a changed payload returns conflict. Otherwise upsert only the current tenant/SKU, append a receipt, and return applied. Later rows may update the same SKU. Do not mutate inputs; initial receipts and products are valid.',
    ],
    candidateTasks: ['Implement partial success, receipt-based recovery, and tenant-scoped upserts.', 'Explain transaction boundaries, parallel worker claims, and why one global last-row cursor is unsafe.'],
    starterCode: `function solution({ tenantId, products, receipts, rows }) {
  const copy = products.map(product => ({ ...product }));
  const outcomes = rows.map(row => {
    const product = copy.find(product => product.sku === row.sku);
    if (product) product.priceCents = row.priceCents;
    else copy.push({ tenantId, sku: row.sku, priceCents: row.priceCents });
    return "applied";
  });
  return { products: copy, receipts: receipts.slice(), outcomes };
}`,
    testCases: [
      tc('import-1', 'New row creates product and durable receipt', { tenantId: 'a', importId: 'job', products: [], receipts: [], rows: [{ rowNumber: 1, sku: ' X ', priceCents: 100 }] }, { products: [{ tenantId: 'a', sku: 'X', priceCents: 100 }], receipts: [{ tenantId: 'a', importId: 'job', rowNumber: 1, sku: 'X', priceCents: 100 }], outcomes: ['applied'] }),
      tc('import-2', 'Existing receipt makes retry a no-op', { tenantId: 'a', importId: 'job', products: [{ tenantId: 'a', sku: 'X', priceCents: 200 }], receipts: [{ tenantId: 'a', importId: 'job', rowNumber: 1, sku: 'X', priceCents: 100 }], rows: [{ rowNumber: 1, sku: 'X', priceCents: 100 }] }, { products: [{ tenantId: 'a', sku: 'X', priceCents: 200 }], receipts: [{ tenantId: 'a', importId: 'job', rowNumber: 1, sku: 'X', priceCents: 100 }], outcomes: ['duplicate'] }),
      tc('import-3', 'Changed replay is rejected', { tenantId: 'a', importId: 'job', products: [{ tenantId: 'a', sku: 'X', priceCents: 100 }], receipts: [{ tenantId: 'a', importId: 'job', rowNumber: 1, sku: 'X', priceCents: 100 }], rows: [{ rowNumber: 1, sku: 'X', priceCents: 999 }] }, { products: [{ tenantId: 'a', sku: 'X', priceCents: 100 }], receipts: [{ tenantId: 'a', importId: 'job', rowNumber: 1, sku: 'X', priceCents: 100 }], outcomes: ['conflict'] }, true),
      tc('import-4', 'Same SKU in another tenant stays unchanged', { tenantId: 'a', importId: 'job', products: [{ tenantId: 'b', sku: 'X', priceCents: 500 }], receipts: [], rows: [{ rowNumber: 1, sku: 'X', priceCents: 100 }] }, { products: [{ tenantId: 'b', sku: 'X', priceCents: 500 }, { tenantId: 'a', sku: 'X', priceCents: 100 }], receipts: [{ tenantId: 'a', importId: 'job', rowNumber: 1, sku: 'X', priceCents: 100 }], outcomes: ['applied'] }, true),
      tc('import-5', 'Invalid rows do not block valid rows or claim receipts', { tenantId: 'a', importId: 'job', products: [], receipts: [], rows: [{ rowNumber: 1, sku: 'X', priceCents: -1 }, { rowNumber: 1, sku: 'X', priceCents: 0 }, { rowNumber: 2, sku: ' ', priceCents: 100 }, { rowNumber: 3, sku: 'Y', priceCents: 1.5 }] }, { products: [{ tenantId: 'a', sku: 'X', priceCents: 0 }], receipts: [{ tenantId: 'a', importId: 'job', rowNumber: 1, sku: 'X', priceCents: 0 }], outcomes: ['invalid', 'applied', 'invalid', 'invalid'] }, true),
      tc('import-6', 'Receipt identity includes the import job', { tenantId: 'a', importId: 'new', products: [{ tenantId: 'a', sku: 'X', priceCents: 100 }], receipts: [{ tenantId: 'a', importId: 'old', rowNumber: 1, sku: 'X', priceCents: 100 }], rows: [{ rowNumber: 1, sku: 'X', priceCents: 200 }] }, { products: [{ tenantId: 'a', sku: 'X', priceCents: 200 }], receipts: [{ tenantId: 'a', importId: 'old', rowNumber: 1, sku: 'X', priceCents: 100 }, { tenantId: 'a', importId: 'new', rowNumber: 1, sku: 'X', priceCents: 200 }], outcomes: ['applied'] }, true),
      tc('import-7', 'Later rows update a SKU without making earlier retries destructive', { tenantId: 'a', importId: 'job', products: [], receipts: [], rows: [{ rowNumber: 1, sku: 'X', priceCents: 100 }, { rowNumber: 2, sku: 'X', priceCents: 200 }, { rowNumber: 1, sku: ' X ', priceCents: 100 }] }, { products: [{ tenantId: 'a', sku: 'X', priceCents: 200 }], receipts: [{ tenantId: 'a', importId: 'job', rowNumber: 1, sku: 'X', priceCents: 100 }, { tenantId: 'a', importId: 'job', rowNumber: 2, sku: 'X', priceCents: 200 }], outcomes: ['applied', 'applied', 'duplicate'] }, true),
    ],
    hints: ['A product key and an import-row key represent different identities.', 'A receipt proves that a row was applied, even if a later row has since changed the product.'],
    assessment: 'Retries do not overwrite later rows and product identity includes the trusted tenant.',
    referenceSolution: {
      explanation: 'The starter searches SKU globally and has no durable receipt. Normalize and validate each row before claiming its identity. A receipt stores the original normalized payload so a replay is either a no-op or an explicit conflict, never a destructive reapplication. In production make receipt claim and tenant-scoped product upsert one transaction, with unique constraints on tenant/import/row and tenant/SKU. A failed upsert must roll back the receipt. This fixture assumes ordered rows; parallel workers need per-SKU ordering or source revisions to prevent an older row winning. Bind job ownership to authenticated tenant context and the original file checksum. Test restart after commit, rollback before commit, duplicate delivery, and two tenants sharing a SKU. Expose per-row errors and durable progress; pause a bad import and compensate from versioned before-images rather than replaying old rows indiscriminately.',
      codeOrArtifact: `function solution({ tenantId, importId, products, receipts, rows }) {
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
}`,
    },
    alternativeApproaches: ['Validate into staging tables, then publish a versioned catalog atomically when all rows satisfy the chosen import policy.'],
    commonMistakes: ['Skipping every row before a global cursor when processing was parallel or partial.', 'Recording a receipt before a product update without a shared transaction.'],
    followUpQuestions: [{ id: 'import-file', question: 'What if the user uploads an edited file using the same job ID?', expectedConcepts: ['immutable source identity', 'checksum', 'conflict'], sampleStrongAnswer: 'Bind the job to the original checksum and tenant. Reject a different file under that identity and create a new job; do not reinterpret existing row receipts as evidence for the edited source.' }],
  }),
];
