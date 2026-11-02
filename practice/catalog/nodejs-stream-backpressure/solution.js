const { Readable } = require('stream');

/**
 * Buggy Memory-Flooding Exporter
 */
async function exportAuditCsv(req, res, db) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="audit.csv"');

  // BUG 1: Loads entire multi-gigabyte dataset into V8 heap at once
  const rows = await db.query('SELECT * FROM transactions');

  // BUG 2: Ignores backpressure! res.write() returns false when TCP send buffer is full,
  // but this loop continues shoving data into the unbounded internal buffer until OOM crash.
  for (const row of rows) {
    const csvLine = `${row.id},${row.amount},${row.timestamp}\n`;
    res.write(csvLine);
  }

  res.end();
}

function solution(input) {
  return "stream_pipeline_backpressure_handled";
}