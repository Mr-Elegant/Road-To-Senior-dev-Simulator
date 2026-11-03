const solution = (function solution({ count, edges }) { const adj = Array.from({ length: count }, () => []); edges.forEach(([a, b], id) => { adj[a].push([b, id]); adj[b].push([a, id]); }); const seen = new Set(); function dfs(v, incoming) { seen.add(v); for (const [next, id] of adj[v]) {
        if (id === incoming)
            continue;
        if (seen.has(next) || dfs(next, id))
            return true;
    } return false; } for (let i = 0; i < count; i++)
        if (!seen.has(i) && dfs(i, -1))
            return true; return false; });
