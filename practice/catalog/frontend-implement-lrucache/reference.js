const solution = (function solution({ capacity, commands }) { const cache = new Map(); return commands.map((c) => { if (c.type === 'get') {
        if (!cache.has(c.key))
            return null;
        const value = cache.get(c.key);
        cache.delete(c.key);
        cache.set(c.key, value);
        return value;
    } cache.delete(c.key); if (capacity > 0) {
        cache.set(c.key, c.value);
        if (cache.size > capacity)
            cache.delete(cache.keys().next().value);
    } return null; }); });
