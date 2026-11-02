# Self-Joins for Hierarchical and Comparative Analysis

Collection: sql · ID: `sql-t2-10` · Mode: **guided**

## Business context

An organizational chart table `employees (id, name, manager_id)` stores both workers and their direct managers in the same table.

## Task

What is a Self-Join? Write a query showing how to retrieve each employee's name along with their manager's name. Why must a LEFT JOIN be used if top executives have no manager?

## Follow-up questions

- How do you query arbitrary-depth organizational hierarchies (e.g. employee -> manager -> VP -> CEO) in PostgreSQL?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
