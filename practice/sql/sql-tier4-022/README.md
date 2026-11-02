# High-Availability Failover Architectures: Patroni, Raft Quorum, and Split-Brain Defense

Collection: sql · ID: `sql-tier4-022` · Mode: **guided**

## Business context

During a network partition between AWS Availability Zones, an automated failover script promoted the read-replica to primary. However, the original primary was still alive and accepting writes from half the Kubernetes pods, resulting in catastrophic split-brain data corruption.

## Task

Design a resilient High-Availability (HA) architecture for PostgreSQL using Patroni and a Distributed Consensus Store (DCS) such as etcd or Consul. Explain Raft consensus quorum, leader leases, fencing mechanisms (STONITH / Watchdog), and how synchronous replication with quorum commit prevents data divergence.

## Follow-up questions

- What is `pg_rewind`, and how does Patroni use it when an old fenced primary is powered back on after failover?

## Work locally

Edit [answer.md](answer.md). Keep the original function names and input/output contracts.

This is a guided exercise. Review your answer against the rubric and reference; no automated correctness score is claimed. If code is supplied, edit and run it with the appropriate local tooling and add your own tests.

Full authored task data (including review files, telemetry, stages, requirements, hints, and examples where supplied) is in [exercise.json](exercise.json).

After your attempt, open [reference.md](reference.md) for the authored answer, rubric, follow-ups, and solution.
