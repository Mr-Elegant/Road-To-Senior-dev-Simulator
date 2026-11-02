function ingestMetricsOptimized(rawSamples) {
  // Pre-allocated aggregators map
  const aggregates = new Map();

  for (let i = 0; i < rawSamples.length; i++) {
    const line = rawSamples[i];
    
    // Find commas without allocating arrays
    const firstComma = line.indexOf(',');
    const secondComma = line.indexOf(',', firstComma + 1);
    const thirdComma = line.indexOf(',', secondComma + 1);

    const metricName = line.slice(firstComma + 1, secondComma);
    const value = parseFloat(line.slice(secondComma + 1, thirdComma === -1 ? undefined : thirdComma));

    let agg = aggregates.get(metricName);
    if (!agg) {
      agg = { count: 0, sum: 0, min: Infinity, max: -Infinity };
      aggregates.set(metricName, agg);
    }

    agg.count++;
    agg.sum += value;
    if (value < agg.min) agg.min = value;
    if (value > agg.max) agg.max = value;
  }

  return aggregates;
}
