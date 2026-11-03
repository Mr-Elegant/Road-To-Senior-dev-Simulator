const solution = (function solution({ count, edges }) { const adj = Array.from({ length: count }, () => []); for (const [a, b] of edges)
        adj[a].push(b); adj.forEach(a => a.sort((x, y) => x - y)); const state = Array(count).fill(0), out = []; function dfs(v) { if (state[v] === 1)
        throw new Error('Cycle'); if (state[v] === 2)
        return; state[v] = 1; for (const next of adj[v])
        dfs(next); state[v] = 2; out.push(v); } for (let v = 0; v < count; v++)
        dfs(v); return out.reverse(); });
