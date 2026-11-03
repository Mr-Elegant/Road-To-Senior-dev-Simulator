const solution = (function solution(commands) { const incoming = [], outgoing = []; return commands.map(c => { if (c.type === 'enqueue') {
        incoming.push(c.value);
        return incoming.length + outgoing.length;
    } if (c.type === 'size')
        return incoming.length + outgoing.length; if (!outgoing.length)
        while (incoming.length)
            outgoing.push(incoming.pop()); if (c.type === 'peek')
        return outgoing.length ? outgoing[outgoing.length - 1] : null; return outgoing.length ? outgoing.pop() : null; }); });
