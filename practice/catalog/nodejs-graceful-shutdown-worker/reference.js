function setupGracefulShutdown(server, dbPool, jobQueue) {
  let isShuttingDown = false;

  async function shutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`Received ${signal}. Starting graceful shutdown...`);

    // Safety timeout: force exit if tasks hang
    const forceExitTimer = setTimeout(() => {
      console.error('Graceful shutdown timed out after 20s. Forcing exit.');
      process.exit(1);
    }, 20000);
    forceExitTimer.unref();

    try {
      // 1. Pause queue: Stop taking new jobs
      if (jobQueue) {
        await jobQueue.pause(true); // wait for active jobs to finish
      }

      // 2. Stop accepting new HTTP connections
      await new Promise((resolve) => server.close(resolve));

      // 3. Close database connection pool
      await dbPool.end();

      console.log('All connections closed cleanly. Exiting.');
      process.exit(0);
    } catch (err) {
      console.error('Error during graceful shutdown:', err);
      process.exit(1);
    }
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
