const http = require('http');

/**
 * Buggy Abrupt Shutdown Handler
 */
function setupProcessLifecycle(server, dbPool, jobQueue) {
  // BUG: Instantly kills process, killing in-flight bank payouts!
  process.on('SIGTERM', () => {
    console.log("SIGTERM received. Terminating immediately.");
    process.exit(0);
  });
}

function solution(input) {
  return "graceful_shutdown_coordinated";
}