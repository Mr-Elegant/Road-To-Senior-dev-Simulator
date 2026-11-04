# Reference: PostgreSQL JIT Compilation: Overhead, Thresholds, and OLTP Regressions

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. What JIT Does in PostgreSQL:**\n- PostgreSQL uses LLVM to dynamically compile parts of a SQL query into native machine code at runtime.\n- **Accelerated Components**:\n  - *Expression Evaluation*: Compiles complex WHERE clauses, mathematical projections, and aggregate calculations into native CPU instructions, removing function call overhead.\n  - *Tuple Deforming*: Generates specialized native code to extract column values from raw 8KB heap tuples based on null bitmaps and variable-length offsets.\n\n**2. Why JIT Causes OLTP Regressions:**\n- LLVM compilation is CPU-heavy. Inlining, LLVM IR optimization, and emitting machine code frequently takes **50ms to 200ms**.\n- For an analytical query scanning 100 million rows for 2 minutes, spending 100ms compiling machine code saves 20 seconds (huge net win).\n- For an OLTP query that should complete in 2ms, spending 100ms on JIT compilation increases response time by 5,000% (severe regression).\n\n**3. Controlling JIT Configuration:**\n- `jit`: Master switch (`on` or `off`).\n- `jit_above_cost`: Queries with estimated planner cost exceeding this threshold engage JIT (default 100,000).\n- `jit_inline_above_cost`: Threshold to perform function inlining (default 500,000).\n- `jit_optimize_above_cost`: Threshold to run expensive LLVM optimization passes (default 500,000).\n- *OLTP Recommendation*: For purely transactional OLTP databases, disable JIT globally (`jit = off`) or set `jit_above_cost = 1000000`.",
    "followUp": {
      "question": "Why does a query with a low actual execution time trigger JIT if `jit_above_cost = 100000` is set to a high number?",
      "expectedAnswer": "JIT engages based on the query planner’s **estimated cost**, not the actual execution time. If outdated statistics or cross-column correlations cause the planner to overestimate the cost (e.g. estimating a cost of 350,000 for a query that actually touches only 10 rows), PostgreSQL will spend 100ms compiling JIT code for a query that finishes in microseconds."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 20,
    "performanceWeight": 30,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains what JIT compiles (expressions, tuple deforming)",
      "Identifies LLVM compilation latency as the root cause of OLTP spikes",
      "Details jit_above_cost and related configuration parameters",
      "Explains discrepancy between planner estimated cost and actual runtime"
    ]
  },
  "expectedConcepts": [
    "LLVM native machine code compilation at runtime",
    "Expression evaluation and tuple deforming acceleration",
    "Compilation time overhead (50-200ms) dominating sub-second OLTP queries",
    "jit_above_cost and jit_optimize_above_cost thresholds",
    "OLTP best practice: disable JIT or raise cost threshold"
  ]
}
```
