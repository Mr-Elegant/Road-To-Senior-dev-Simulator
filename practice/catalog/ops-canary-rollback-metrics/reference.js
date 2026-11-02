function evaluateCanaryHealth(baselineMetrics, canaryMetrics) {
  const errorRateDelta = canaryMetrics.errorRate - baselineMetrics.errorRate;
  const latencyRatio = canaryMetrics.p95LatencyMs / Math.max(1, baselineMetrics.p95LatencyMs);

  if (errorRateDelta > 0.015) {
    return {
      rollback: true,
      action: 'ABORT_CANARY',
      reason: `Error rate delta of ${(errorRateDelta * 100).toFixed(2)}% breached 1.5% threshold`,
    };
  }

  if (latencyRatio > 1.5) {
    return {
      rollback: true,
      action: 'ABORT_CANARY',
      reason: `P95 latency increased by ${((latencyRatio - 1) * 100).toFixed(1)}%`,
    };
  }

  return {
    rollback: false,
    action: 'CONTINUE_PROMOTION',
    reason: 'Canary within acceptable performance bounds',
  };
}
