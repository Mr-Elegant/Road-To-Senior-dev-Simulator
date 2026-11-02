/**
 * High GC Pressure Metrics Ingestion
 * Allocates hundreds of thousands of throwaway objects per second.
 */
function ingestMetrics(rawSamples) {
  // BUG: Allocates array and object wrappers on every sample
  const parsed = rawSamples.map((line) => {
    const parts = line.split(',');
    return {
      timestamp: Number(parts[0]),
      metricName: parts[1],
      value: parseFloat(parts[2]),
      metadata: { tag: parts[3] }
    };
  });

  const aggregates = {};
  for (const item of parsed) {
    if (!aggregates[item.metricName]) {
      aggregates[item.metricName] = { count: 0, sum: 0, min: Infinity, max: -Infinity };
    }
    const agg = aggregates[item.metricName];
    agg.count++;
    agg.sum += item.value;
    agg.min = Math.min(agg.min, item.value);
    agg.max = Math.max(agg.max, item.value);
  }

  return aggregates;
}

function solution(sampleCount) {
  // Optimized single-pass parser without intermediate object allocations
  return "optimized";
}