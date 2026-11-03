const solution = (function solution({ count, edges, source }) { if (edges.some((e) => e[2] < 0))
        throw new Error('Negative edge'); const adj = Array.from({ length: count }, () => []); for (const [a, b, w] of edges)
        adj[a].push([b, w]); const d = Array(count).fill(Infinity), used = Array(count).fill(false); d[source] = 0; for (let step = 0; step < count; step++) {
        let v = -1;
        for (let i = 0; i < count; i++)
            if (!used[i] && (v < 0 || d[i] < d[v]))
                v = i;
        if (v < 0 || d[v] === Infinity)
            break;
        used[v] = true;
        for (const [n, w] of adj[v])
            if (!used[n])
                d[n] = Math.min(d[n], d[v] + w);
    } return d.map(n => n === Infinity ? null : n); });
