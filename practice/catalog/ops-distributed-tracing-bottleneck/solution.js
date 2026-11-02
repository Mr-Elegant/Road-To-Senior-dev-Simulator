/**
 * Sequential RPC Bottleneck in Distributed Trace
 */
async function calculateFaresForDrivers(pricingClient, rideRequest, candidateDrivers) {
  const driverQuotes = [];

  // BUG: Sequential remote RPC calls in loop!
  // If each RPC call takes 180ms, 20 drivers = 3,600ms latency!
  for (const driver of candidateDrivers) {
    const quote = await pricingClient.getDriverQuote({
      rideId: rideRequest.id,
      driverId: driver.id,
      distanceKm: driver.distanceKm,
    });
    driverQuotes.push({ driver, quote });
  }

  return driverQuotes;
}

function solution(input) {
  return "batch_rpc_and_w3c_trace_propagated";
}