const solution = (function solution({ entries, prefix, limit }) { const root = { children: new Map(), entries: [] }; for (const entry of entries) {
        let node = root;
        node.entries.push(entry);
        for (const c of entry.word) {
            if (!node.children.has(c))
                node.children.set(c, { children: new Map(), entries: [] });
            node = node.children.get(c);
            node.entries.push(entry);
        }
    } let node = root; for (const c of prefix.toLowerCase()) {
        node = node.children.get(c);
        if (!node)
            return [];
    } return [...node.entries].sort((a, b) => b.score - a.score || (a.word < b.word ? -1 : a.word > b.word ? 1 : 0)).slice(0, limit).map(e => e.word); });
