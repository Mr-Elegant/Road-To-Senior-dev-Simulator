const solution = (function solution(tasks) { const byId = new Map(tasks.map(t => [t.id, t])); for (const t of tasks)
        for (const dep of t.deps)
            if (!byId.has(dep))
                throw new Error('Missing dependency'); const done = new Set(), layers = []; while (done.size < tasks.length) {
        const ready = tasks.filter(t => !done.has(t.id) && t.deps.every((id) => done.has(id))).map(t => t.id).sort();
        if (!ready.length)
            throw new Error('Cycle');
        layers.push(ready);
        ready.forEach(id => done.add(id));
    } return layers; });
