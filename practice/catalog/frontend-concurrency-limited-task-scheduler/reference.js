const solution = (function solution({ limit, commands }) { if (!Number.isInteger(limit) || limit < 1)
        throw new Error('Invalid limit'); const active = [], queued = [], completed = [], cancelled = []; const remove = (a, id) => { const i = a.indexOf(id); if (i < 0)
        return false; a.splice(i, 1); return true; }; for (const c of commands) {
        if (c.type === 'enqueue')
            queued.push(c.id);
        if (c.type === 'complete' && remove(active, c.id))
            completed.push(c.id);
        if (c.type === 'cancel' && (remove(queued, c.id) || remove(active, c.id)))
            cancelled.push(c.id);
        while (active.length < limit && queued.length)
            active.push(queued.shift());
    } return { active, queued, completed, cancelled }; });
