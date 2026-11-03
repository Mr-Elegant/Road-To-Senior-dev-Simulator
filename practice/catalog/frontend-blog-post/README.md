# Frontend: Blog Post

Collection: catalog · ID: `frontend-blog-post` · Mode: **react**

## Business context

Build and verify the core behavior behind Blog Post. This independently authored exercise has a bounded, explicit contract. Injected clock, network, random, or worker models are identified in the contract; they do not claim production service guarantees.

## Task

Export App({post}). Render an article with an h1 title, author in [data-testid="author"], body as plain text in [data-testid="body"], and time with dateTime=post.date. Missing post renders Article unavailable. Author defaults to Unknown. Never interpret body HTML.

## Candidate tasks

- Implement the documented behavior without hard-coding fixture answers.
- Run the full suite, investigate boundary failures, and explain the follow-up variation.

## Constraints

- Export default App. Only react and react/jsx-runtime imports are supported. The DOM contract and supplied props define the exercise.
- Preserve identity, ordering, boundary behavior, and error messages stated in the contract. Passing fixtures verifies this contract, not every production concern.

## Follow-up questions

- Support a sanitized rich-content format while keeping heading hierarchy and link semantics intact.

## Work locally

Edit [solution.jsx](solution.jsx) and record your reasoning in [answer.md](answer.md). Keep the original function names and input/output contracts.

Run from the repository root:

```sh
npm run practice:test -- catalog/frontend-blog-post
npm run practice:watch -- catalog/frontend-blog-post
```

Cases are visible in [test-cases.json](test-cases.json).

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
