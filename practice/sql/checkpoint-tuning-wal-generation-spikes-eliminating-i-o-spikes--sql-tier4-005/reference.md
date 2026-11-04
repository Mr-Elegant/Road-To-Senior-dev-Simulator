# Reference: Checkpoint Tuning & WAL Generation Spikes: Eliminating I/O Spikes

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. What a Checkpoint Does:**\n- PostgreSQL buffers table and index page modifications in memory (`shared_buffers`). Dirty pages are not immediately written to disk.\n- A checkpoint flushes all dirty shared buffer pages to persistent disk storage, writes a checkpoint record to the WAL, and removes obsolete WAL files.\n- It guarantees that crash recovery will only need to replay WAL records generated **after** the checkpoint record.\n\n**2. Checkpoint Triggers:**\n- **Time-based**: `checkpoint_timeout` (default 5 min). A checkpoint runs automatically when this duration expires.\n- **Volume-based**: `max_wal_size` (default 1GB). If WAL volume generated since last checkpoint exceeds this ceiling, PostgreSQL triggers an **immediate emergency checkpoint** (`checkpoints occurring too frequently`), causing severe disk I/O storms.\n\n**3. Checkpoint Spreading (Smoothing I/O):**\n- `checkpoint_completion_target`: Sets the fraction of `checkpoint_timeout` over which the checkpoint I/O should be smoothed (default 0.9 in modern PG).\n- If `checkpoint_timeout = 15min` and `checkpoint_completion_target = 0.9`, Postgres spreads dirty page writes over $15 \\times 0.9 = 13.5$ minutes, eliminating sharp disk I/O spikes.\n\n**4. Full-Page Writes (FPWs) and Write Amplification:**\n- To protect against torn pages (where the OS or disk controller writes half of an 8KB page during a sudden power loss), PostgreSQL writes the **entire 8KB image** of every page modified for the first time after a checkpoint into WAL.\n- If checkpoints occur every 30 seconds, almost every page write triggers an 8KB full-page write into WAL, causing massive WAL write amplification and disk saturation.\n\n**5. Production Tuning Recommendations:**\n```ini\ncheckpoint_timeout = 15min (or 30min)\nmax_wal_size = 32GB (or 64GB on write-heavy databases)\ncheckpoint_completion_target = 0.9\nmin_wal_size = 4GB\n```",
    "followUp": {
      "question": "What is the trade-off of increasing `checkpoint_timeout` to 30 minutes and `max_wal_size` to 64GB?",
      "expectedAnswer": "The trade-off is crash recovery time (MTTR). In the event of an abrupt server crash or power failure, PostgreSQL must replay all WAL records generated since the last successful checkpoint. A 30-minute checkpoint interval means recovery replay will take several minutes to complete before the database can accept incoming connections."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains dirty page flushing and crash recovery boundary",
      "Differentiates time-based vs volume-based checkpoint triggers",
      "Explains checkpoint_completion_target I/O smoothing calculation",
      "Details full-page writes (FPW) mechanics and recovery trade-offs"
    ]
  },
  "expectedConcepts": [
    "Dirty page flushing from shared_buffers to persistent storage",
    "checkpoint_timeout vs max_wal_size triggers",
    "checkpoint_completion_target I/O spreading over time",
    "full_page_writes (FPW) preventing torn pages after crash",
    "Write amplification caused by frequent checkpoints"
  ]
}
```
