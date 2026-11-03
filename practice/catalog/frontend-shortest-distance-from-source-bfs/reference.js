const solution = (function solution({ count, edges, source }) { const adj = Array.from({ length: count }, () => []); for (const [a, b] of edges) {
        adj[a].push(b);
        adj[b].push(a);
    } const distance = Array(count).fill(null), queue = [source]; distance[source] = 0; for (let head = 0; head < queue.length; head++) {
        const v = queue[head];
        for (const n of adj[v])
            if (distance[n] === null) {
                distance[n] = distance[v] + 1;
                queue.push(n);
            }
    } return distance; });
