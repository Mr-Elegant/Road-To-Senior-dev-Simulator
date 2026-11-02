class ConnectionHub {
  constructor() {
    this.clients = new Set();
  }

  registerConnection(req, res) {
    const clientId = String(req.headers['x-client-id'] || crypto.randomUUID());

    const client = {
      id: clientId,
      send: (data) => {
        res.write(`data: ${JSON.stringify({ clientId, payload: data })}\n\n`);
      }
    };

    this.clients.add(client);

    const cleanup = () => {
      this.clients.delete(client);
      req.off('close', cleanup);
      req.off('error', cleanup);
      try { res.end(); } catch (_) {}
    };

    req.on('close', cleanup);
    req.on('error', cleanup);
  }
}
