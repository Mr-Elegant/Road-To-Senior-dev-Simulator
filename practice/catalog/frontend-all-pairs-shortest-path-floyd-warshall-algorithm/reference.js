const solution = (function solution({ count, edges }) { const d = Array.from({ length: count }, (_, i) => Array.from({ length: count }, (_, j) => i === j ? 0 : Infinity)); for (const [a, b, w] of edges)
        d[a][b] = Math.min(d[a][b], w); for (let k = 0; k < count; k++)
        for (let i = 0; i < count; i++)
            for (let j = 0; j < count; j++)
                if (d[i][k] !== Infinity && d[k][j] !== Infinity)
                    d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]); if (d.some((row, i) => row[i] < 0))
        throw new Error('Negative cycle'); return d.map(row => row.map(v => v === Infinity ? null : v)); });
