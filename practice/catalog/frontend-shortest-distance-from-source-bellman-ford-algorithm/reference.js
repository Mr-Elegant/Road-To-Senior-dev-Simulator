const solution = (function solution({ count, edges, source }) { const d = Array(count).fill(Infinity); d[source] = 0; for (let step = 0; step < count - 1; step++) {
        let changed = false;
        for (const [a, b, w] of edges)
            if (d[a] !== Infinity && d[a] + w < d[b]) {
                d[b] = d[a] + w;
                changed = true;
            }
        if (!changed)
            break;
    } for (const [a, b, w] of edges)
        if (d[a] !== Infinity && d[a] + w < d[b])
            throw new Error('Negative cycle'); return d.map(v => v === Infinity ? null : v); });
