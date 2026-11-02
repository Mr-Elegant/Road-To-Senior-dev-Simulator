const { pipeline, Transform } = require('stream');
const QueryStream = require('pg-query-stream');

async function exportAuditCsvStream(req, res, dbClient) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="audit.csv"');

  // 1. Fetch via database cursor with batch size 500
  const query = new QueryStream('SELECT id, amount, timestamp FROM transactions', [], {
    batchSize: 500,
  });
  const stream = dbClient.query(query);

  // 2. Transform database row objects into CSV strings
  const csvTransform = new Transform({
    objectMode: true,
    transform(row, encoding, callback) {
      const line = `${row.id},${row.amount},${row.timestamp}\n`;
      callback(null, line);
    },
  });

  // 3. pipeline handles backpressure, drain events, and cleans up streams on client abort
  pipeline(stream, csvTransform, res, (err) => {
    if (err) {
      console.error('Pipeline error or client aborted download', err);
    }
  });
}
