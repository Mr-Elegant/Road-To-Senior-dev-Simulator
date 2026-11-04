# Reference: Linux OOM Killer Tuning, overcommit_memory, and PostgreSQL Work_mem

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. How the Crash Happened (Signal 9 SIGKILL):**\n- When the Linux kernel runs out of physical RAM and swap, the OOM Killer chooses a process with a high badness score and issues `SIGKILL` (signal 9).\n- If the kernel kills a PostgreSQL backend process holding shared memory locks, PostgreSQL detects that shared memory might be corrupted and immediately terminates all other backends and restarts to execute crash recovery.\n- If the kernel kills the main postmaster daemon directly, the entire service dies instantly.\n\n**2. Memory Multiplication Trap (`work_mem`):**\n- `shared_buffers` is allocated once at startup (e.g. 16GB).\n- `work_mem` (e.g. set to 256MB) is allocated **per sort/hash operation per query**.\n- A complex query with 4 joins and 2 sorts can allocate $6 \\times 256\\text{MB} = 1.5\\text{GB}$ for a single backend!\n- If 100 concurrent connections run complex queries, RAM consumption surges to $100 \\times 1.5\\text{GB} = 150\\text{GB}$, easily crushing a 64GB server.\n\n**3. Linux Kernel Configuration Safeguards:**\n- Set `vm.overcommit_memory = 2` (never overcommit) and `vm.overcommit_ratio = 80` in `/etc/sysctl.conf`. This prevents Linux from promising more RAM than physically exists plus swap.\n- **Protect Postmaster from OOM Killer**:\n  In systemd service definition for PostgreSQL, set:\n  `OOMScoreAdjust=-1000`\n  This tells the Linux kernel to never kill the postmaster process, forcing it to sacrifice individual runaway client processes instead.",
    "followUp": {
      "question": "How should `work_mem` be configured safely on a database that serves both fast OLTP queries and occasional heavy reporting queries?",
      "expectedAnswer": "Keep global `work_mem` low (e.g., 8MB to 16MB) in `postgresql.conf` to protect against OLTP concurrency spikes. For specific batch jobs or reporting queries that genuinely need large in-memory sorts, set it dynamically for that specific transaction or session only: `SET LOCAL work_mem = '512MB';`."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 20,
    "performanceWeight": 30,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains why signal 9 triggers complete database cluster restart",
      "Details work_mem allocation per sort/hash operator",
      "Configures Linux overcommit_memory and overcommit_ratio",
      "Sets OOMScoreAdjust=-1000 for postmaster daemon"
    ]
  },
  "expectedConcepts": [
    "Linux OOM killer killing processes with SIGKILL (signal 9)",
    "Shared memory corruption risk forcing database restart",
    "work_mem allocated per operation per connection (multiplication factor)",
    "vm.overcommit_memory = 2 (strict no-overcommit)",
    "OOMScoreAdjust=-1000 protecting postmaster in systemd"
  ]
}
```
