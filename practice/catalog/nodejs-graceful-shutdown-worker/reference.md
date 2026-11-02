# Reference: Kubernetes Rolling Deployment Background Transaction Data Loss

Read after attempting the exercise. This is authored guidance, not certification.

```json
{
  "solution": {
    "explanation": "When Kubernetes terminates a pod (during rolling updates, auto-scaling, or node drain):\n1. Pod is set to Terminating state and removed from Service endpoints.\n2. Kubernetes sends SIGTERM signal to PID 1 inside the container.\n3. Kubernetes waits for 'terminationGracePeriodSeconds' (default 30s).\n4. If the process is still running after the grace period, Kubernetes sends SIGKILL (kill -9).\n      \nIf the Node.js application calls 'process.exit(0)' immediately upon SIGTERM, in-flight HTTP requests and background database transactions are severed instantly.\n      \nFix:\nCoordinate an orderly shutdown sequence:\n1. Stop accepting new HTTP requests ('server.close()') and pause queue consumer.\n2. Track active in-flight transactions and await their completion.\n3. Drain and close database connection pool ('pool.end()').\n4. Include a safety timeout (e.g. 15s) so if a task is deadlocked, the process exits cleanly before SIGKILL.",
    "codeOrArtifact": "function setupGracefulShutdown(server, dbPool, jobQueue) {\n  let isShuttingDown = false;\n\n  async function shutdown(signal) {\n    if (isShuttingDown) return;\n    isShuttingDown = true;\n    console.log(`Received ${signal}. Starting graceful shutdown...`);\n\n    // Safety timeout: force exit if tasks hang\n    const forceExitTimer = setTimeout(() => {\n      console.error('Graceful shutdown timed out after 20s. Forcing exit.');\n      process.exit(1);\n    }, 20000);\n    forceExitTimer.unref();\n\n    try {\n      // 1. Pause queue: Stop taking new jobs\n      if (jobQueue) {\n        await jobQueue.pause(true); // wait for active jobs to finish\n      }\n\n      // 2. Stop accepting new HTTP connections\n      await new Promise((resolve) => server.close(resolve));\n\n      // 3. Close database connection pool\n      await dbPool.end();\n\n      console.log('All connections closed cleanly. Exiting.');\n      process.exit(0);\n    } catch (err) {\n      console.error('Error during graceful shutdown:', err);\n      process.exit(1);\n    }\n  }\n\n  process.on('SIGTERM', () => shutdown('SIGTERM'));\n  process.on('SIGINT', () => shutdown('SIGINT'));\n}"
  },
  "rubric": [
    {
      "id": "rb-graceful-shutdown",
      "category": "reliability",
      "label": "Production Lifecycle & Graceful Teardown",
      "description": "Implements orderly teardown of servers, queues, and database connections.",
      "weight": 5,
      "levels": [
        {
          "score": 3,
          "description": "Stops ingestion, drains pending work, closes DB pool, and sets hard fallback timer."
        },
        {
          "score": 2,
          "description": "Closes server but forgets DB pool cleanup or force-kill timeout."
        },
        {
          "score": 0,
          "description": "Calls process.exit immediately."
        }
      ]
    }
  ],
  "alternatives": [
    "Using Kubernetes `preStop` hook with `sleep 5` before SIGTERM to allow load balancer iptables propagation."
  ],
  "commonMistakes": [
    "Not calling `forceExitTimer.unref()`, which can keep the event loop alive by itself.",
    "Closing the database pool before waiting for active HTTP requests to complete, causing in-flight requests to fail with \"Connection pool closed\"."
  ],
  "followUps": [
    {
      "id": "node-fq-5",
      "question": "Why do Kubernetes engineers recommend adding a `preStop` sleep 5 hook before SIGTERM in Node.js pods?",
      "expectedConcepts": [
        "IPTables / kube-proxy propagation latency",
        "Preventing traffic routing to a pod after SIGTERM has already begun closing listeners"
      ],
      "sampleStrongAnswer": "When a pod enters Terminating state, kube-proxy and Ingress controllers take a few seconds to update iptables and remove the pod IP from load balancer endpoints. If the pod closes its listening socket immediately upon SIGTERM, requests still in-flight from the load balancer receive `ECONNREFUSED`. A `preStop` sleep 5 ensures no new requests are being routed to the pod before it begins closing sockets."
    }
  ]
}
```
