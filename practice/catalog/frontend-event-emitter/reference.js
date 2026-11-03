const solution = (function solution(commands) { const listeners = new Map(), log = []; for (const c of commands) {
        if (c.type === 'on')
            listeners.set(c.id, { ...c });
        if (c.type === 'off')
            listeners.delete(c.id);
        if (c.type === 'emit') {
            const snapshot = [...listeners.values()].filter(l => l.event === c.event);
            for (const l of snapshot) {
                if (l.once)
                    listeners.delete(l.id);
                log.push([l.id, c.value]);
            }
        }
    } return log; });
