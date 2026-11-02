# E-Commerce Cart Optimistic Mutation Hook with Rollback

Collection: catalog · ID: `react-custom-hook-optimistic-mutation` · Mode: **guided**

## Business context

In a high-conversion checkout experience, users rapidly tap "+ / -" on cart items. Slow 3G network latency causes UI lag and button stutter. Product management requests instant UI updates, but if the inventory check or coupon calculation fails on the server, the cart must roll back seamlessly with a user alert.

## Task

Create a custom hook `useOptimisticCart` that updates local cart count immediately, queues the backend sync mutation, rolls back to previous state if the network request fails, and handles concurrent rapid clicks without corrupting final quantity.

## Candidate tasks

- Store snapshot before mutation in a ref or previous state holder.
- Update UI state optimistically.
- If API rejects, restore previous snapshot and set error message.
- Explain how React 19 `useOptimistic` hook formalizes this pattern.

## Constraints

- UI must update synchronously with zero perceivable delay.
- Server failure must roll back state to pre-mutation snapshot and notify candidate.
- Must handle serialized mutations so consecutive clicks (+1, +1, +1) converge accurately.

## Follow-up questions

- How does React 19 useOptimistic work in tandem with Server Actions?

## Work locally

Edit [solution.js](solution.js) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
