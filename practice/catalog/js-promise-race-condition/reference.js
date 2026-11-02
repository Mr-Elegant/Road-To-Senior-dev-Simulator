class AsyncKeyedMutex {
  constructor() {
    this.locks = new Map();
  }

  async runExclusive(key, task) {
    const previous = this.locks.get(key) || Promise.resolve();

    let release;
    const currentLock = new Promise((resolve) => {
      release = resolve;
    });

    this.locks.set(key, currentLock);

    try {
      await previous;
      return await task();
    } finally {
      release();
      if (this.locks.get(key) === currentLock) {
        this.locks.delete(key);
      }
    }
  }
}
