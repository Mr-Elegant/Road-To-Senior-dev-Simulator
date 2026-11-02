const bcrypt = require('bcrypt');

// In entrypoint script before any async I/O:
// process.env.UV_THREADPOOL_SIZE = '16';

async function verifyUserLogin(plainPassword, passwordHash) {
  // Offloads hashing calculation to libuv background thread pool
  return await bcrypt.compare(plainPassword, passwordHash);
}
