class VaultManagedPool {
  constructor(vaultClient, dbConfig) {
    this.vault = vaultClient;
    this.dbConfig = dbConfig;
    this.currentPool = null;
    this.renewTimer = null;
  }

  async acquireAndConnect() {
    // 1. Fetch dynamic temporary credentials from Vault
    const creds = await this.vault.read('database/creds/app-service-role');
    const { username, password, lease_id, lease_duration } = creds;

    // 2. Instantiate new database pool
    const newPool = new pg.Pool({
      ...this.dbConfig,
      user: username,
      password: password,
    });

    const oldPool = this.currentPool;
    this.currentPool = newPool;

    // 3. Gracefully drain old pool if rotating
    if (oldPool) {
      setTimeout(() => oldPool.end(), 30000); // 30s grace period for in-flight queries
    }

    // 4. Schedule lease renewal at 50% of duration
    const renewalIntervalMs = (lease_duration / 2) * 1000;
    this.renewTimer = setInterval(async () => {
      try {
        await this.vault.write(`sys/leases/renew`, { lease_id });
      } catch (err) {
        console.warn('Lease renewal failed; acquiring fresh credentials...');
        clearInterval(this.renewTimer);
        this.acquireAndConnect();
      }
    }, renewalIntervalMs);
  }
}
