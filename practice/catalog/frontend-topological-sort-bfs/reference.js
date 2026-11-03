const solution = (function solution({ count, edges }) { const adj = Array.from({ length: count }, () => []), degree = Array(count).fill(0); for (const [a, b] of edges) {
        adj[a].push(b);
        degree[b]++;
    } const ready = [], out = []; degree.forEach((d, i) => { if (!d)
        ready.push(i); }); while (ready.length) {
        ready.sort((a, b) => a - b);
        const v = ready.shift();
        out.push(v);
        for (const n of adj[v])
            if (--degree[n] === 0)
                ready.push(n);
    } if (out.length !== count)
        throw new Error('Cycle'); return out; });
