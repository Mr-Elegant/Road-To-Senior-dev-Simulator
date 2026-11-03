const solution = (function solution({ objects, roots }) { const heap = new Map(objects.map((o) => [o.id, o.refs])); for (const refs of heap.values())
        for (const id of refs)
            if (!heap.has(id))
                throw new Error('Dangling reference'); for (const id of roots)
        if (!heap.has(id))
            throw new Error('Unknown root'); const marked = new Set(), stack = [...roots]; while (stack.length) {
        const id = stack.pop();
        if (marked.has(id))
            continue;
        marked.add(id);
        stack.push(...heap.get(id));
    } return { survivors: [...marked].sort(), collected: [...heap.keys()].filter(id => !marked.has(id)).sort() }; });
