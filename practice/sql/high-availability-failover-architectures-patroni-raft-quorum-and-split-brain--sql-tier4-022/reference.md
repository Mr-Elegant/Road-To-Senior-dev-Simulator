# Reference: High-Availability Failover Architectures: Patroni, Raft Quorum, and Split-Brain Defense

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "answer": "**1. Split-Brain Disaster Anatomy:**\n- Split-brain occurs when two nodes simultaneously believe they are the write primary.\n- Clients write Order #101 to Node A, and Order #102 to Node B. Because both nodes assign conflicting sequence IDs and transaction logs diverge, merging the two databases without loss is mathematically and physically impossible.\n\n**2. Patroni + DCS (etcd) Architecture:**\n- **Consensus Quorum**: A 3-node or 5-node `etcd` cluster requires a strict majority ($N/2 + 1$) to elect a leader and maintain state. In a network partition, only the partition with a majority can elect or maintain a leader.\n- **Leader Lease Key**: The primary Patroni node acquires a temporary lease key in etcd (e.g. TTL 10 seconds) with continuous heartbeats. If the primary loses contact with etcd for 10 seconds, its lease expires automatically.\n- **Safe Failover**: The standby node in the majority partition sees the expired lease, checks WAL replay LSN to ensure it has the latest data, and promotes itself to the new primary.\n\n**3. Fencing Mechanisms (Preventing Zombie Primaries):**\n- **Linux Software Watchdog**: Patroni arms the kernel watchdog device (`/dev/watchdog`) every 5 seconds. If Patroni loses contact with DCS or hangs, the watchdog times out and the hardware/kernel immediately forces a hard reset (reboot) of the old primary, guaranteeing it cannot accept rogue writes.\n- **STONITH** (\"Shoot The Other Node In The Head\"): Power-switch fencing via IPMI/cloud API.\n\n**4. Synchronous Replication (`synchronous_commit = 'on'`):**\n- Configured via `synchronous_standby_names = 'FIRST 1 (node2, node3)'`.\n- Transactions on the primary do not commit until at least one synchronous standby has written the WAL to disk, guaranteeing Zero Data Loss (RPO = 0).",
    "followUp": {
      "question": "What is `pg_rewind`, and how does Patroni use it when an old fenced primary is powered back on after failover?",
      "expectedAnswer": "`pg_rewind` is a tool that identifies the exact point where an old primary's WAL diverged from the newly promoted primary, rewinds the old primary's data directory back to that common ancestor checkpoint, and copies only the changed blocks from the new primary, allowing the old primary to rejoin the cluster as a standby replica without re-cloning hundreds of gigabytes from scratch."
    }
  },
  "rubric": {
    "correctnessWeight": 35,
    "semanticRelationalWeight": 25,
    "performanceWeight": 25,
    "edgeCaseWeight": 15,
    "criteria": [
      "Explains split-brain root cause and impossibility of reconciliation",
      "Details etcd Raft consensus majority and leader lease TTL",
      "Explains Linux watchdog / STONITH fencing mechanics",
      "Explains pg_rewind for safe cluster rejoining without full re-cloning"
    ]
  },
  "expectedConcepts": [
    "Split-brain diverging transaction logs and data corruption",
    "etcd/Consul Raft consensus majority quorum (N/2 + 1)",
    "Patroni leader lease TTL and automated promotion",
    "Linux Watchdog / STONITH fencing killing zombie primary",
    "Synchronous replication (synchronous_commit, synchronous_standby_names)"
  ]
}
```
