async function calculateFaresForDriversBatch(pricingClient, rideRequest, candidateDrivers) {
  // Batch RPC endpoint replaces 20 sequential round-trips with 1
  const quotes = await pricingClient.getBatchDriverQuotes({
    rideId: rideRequest.id,
    drivers: candidateDrivers.map((d) => ({
      driverId: d.id,
      distanceKm: d.distanceKm,
    })),
  });

  return candidateDrivers.map((driver, index) => ({
    driver,
    quote: quotes[index],
  }));
}
