# Frontend: Image Carousel

Collection: catalog · ID: `frontend-image-carousel` · Mode: **react**

## Business context

Build and verify the core behavior behind Image Carousel. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({items=[Alpha,Beta,Gamma]}), a image carousel using title strings and local one-pixel images with alt=title. slides container [data-testid=slides] contains one articles with h2 titles. Next/Previous use data-action=next/previous. Navigation wraps. Empty items renders No images.  This exercise focuses selection/window semantics rather than remote image loading.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Pause autoplay on interaction/focus and resume only under an explicit user-controlled policy.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-image-carousel
npm run practice:watch -- catalog/frontend-image-carousel
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
