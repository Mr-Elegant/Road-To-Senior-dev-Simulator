const solution = (function solution({ count, edges }) { const parent = Array.from({ length: count }, (_, i) => i), size = Array(count).fill(1); function find(v) { while (parent[v] !== v) {
        parent[v] = parent[parent[v]];
        v = parent[v];
    } return v; } let weight = 0, components = count; for (const [a, b, w] of [...edges].sort((a, b) => a[2] - b[2])) {
        let ra = find(a), rb = find(b);
        if (ra === rb)
            continue;
        if (size[ra] < size[rb])
            [ra, rb] = [rb, ra];
        parent[rb] = ra;
        size[ra] += size[rb];
        components--;
        weight += w;
    } return { weight, components }; });
