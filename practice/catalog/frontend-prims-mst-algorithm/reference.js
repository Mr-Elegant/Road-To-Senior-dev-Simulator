const solution = (function solution({ count, edges }) { if (!count)
        return 0; const matrix = Array.from({ length: count }, () => Array(count).fill(Infinity)); for (const [a, b, w] of edges)
        matrix[a][b] = matrix[b][a] = Math.min(matrix[a][b], w); const used = Array(count).fill(false), distance = Array(count).fill(Infinity); distance[0] = 0; let total = 0; for (let step = 0; step < count; step++) {
        let v = -1;
        for (let i = 0; i < count; i++)
            if (!used[i] && (v < 0 || distance[i] < distance[v]))
                v = i;
        if (v < 0 || distance[v] === Infinity)
            throw new Error('Disconnected');
        used[v] = true;
        total += distance[v];
        for (let i = 0; i < count; i++)
            if (!used[i])
                distance[i] = Math.min(distance[i], matrix[v][i]);
    } return total; });
