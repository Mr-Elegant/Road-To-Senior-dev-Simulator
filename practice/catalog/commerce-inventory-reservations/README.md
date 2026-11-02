# E-commerce: Stop Overselling the Last Item

Collection: catalog · ID: `commerce-inventory-reservations` · Mode: **javascript**

## Business context

A wholesale checkout sells the last units twice during a promotion. A mobile retry reserves stock again, and a delayed cancellation returns the same units twice.

## Task

Implement solution({ stock, commands }) as a deterministic reservation model. stock is a nonnegative safe integer. Commands have type reserve or release and a nonempty string id. A reserve also has quantity. Process commands in order, returning { available, reservations, outcomes }. Reservations remain in first-successful-reserve order as { id, quantity, status: "held" | "released" }. Each command produces one outcome. This models serialized decisions; it does not simulate concurrent database transactions.

## Candidate tasks

- Fix retry, quantity validation, and release behavior in the function.
- Explain how to enforce the same invariant across multiple checkout workers and reservation expiry.

## Constraints

- For reserve, invalid nonpositive/non-safe-integer quantity returns invalid before any other check. Existing ID with equal quantity returns duplicate, even after release; a changed quantity returns conflict. Then insufficient stock returns unavailable; otherwise return reserved.
- Release returns not_found for an unknown ID, duplicate for an already released ID, otherwise released and restores stock exactly once. Unknown command types return invalid. Do not mutate the input.

## Follow-up questions

- What if payment succeeds while a reservation expires?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/commerce-inventory-reservations
npm run practice:watch -- catalog/commerce-inventory-reservations
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
