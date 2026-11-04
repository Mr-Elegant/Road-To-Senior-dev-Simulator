const express = require('express');
const app = express();

app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});
