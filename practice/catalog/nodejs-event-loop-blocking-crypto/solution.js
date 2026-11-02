const bcrypt = require('bcrypt');

/**
 * Buggy Auth Route: Blocks Node.js Main Event Loop
 */
function verifyUserLogin(plainPassword, passwordHash) {
  // BUG: Synchronous CPU-bound hashing freezes the entire V8 single thread!
  const isMatch = bcrypt.compareSync(plainPassword, passwordHash);
  return isMatch;
}

function solution(input) {
  return "non_blocking_async_libuv";
}