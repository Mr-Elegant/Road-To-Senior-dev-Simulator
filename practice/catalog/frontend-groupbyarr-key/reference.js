const solution = (function solution({ records, key }) { const groups = new Map(); for (const item of records) {
        const k = String(item[key]);
        if (!groups.has(k))
            groups.set(k, []);
        groups.get(k).push(item);
    } return [...groups]; });
