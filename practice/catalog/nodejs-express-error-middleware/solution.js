const express = require('express');
const app = express();

/**
 * Buggy Express Route Handler
 */
app.post('/api/inventory/update', async (req, res, next) => {
  // BUG: Express 4 does not catch errors thrown in unhandled async functions!
  // If updateInventory throws, this promise rejects, next(err) is never called,
  // and the HTTP connection hangs until client timeout.
  const result = await db.updateInventory(req.body);
  res.json({ success: true, result });
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

function solution(input) {
  return "async_handler_wrapped";
}